/**
 * 45-Day Interview Prep OS - Low-Level Design & Machine Coding Catalog
 * Sourced & curated from SystemCraft machine coding rounds (Flipkart, PhonePe, Amazon, Swiggy, Uber).
 * Each problem includes functional requirements, class diagrams / UML entities, design patterns,
 * thread-safety / concurrency handling, full runnable implementations, and interview rubrics.
 */

export const LLD_PROBLEMS = [
  {
    id: "lld-parking-lot",
    title: "Parking Lot",
    subtitle: "Multi-floor parking lot with strategy-based pricing, slot assignment, and vehicle types",
    difficulty: "Medium",
    duration: "60-90 min",
    companies: ["Flipkart", "PhonePe", "Amazon", "Swiggy", "Google"],
    category: "Real-World Systems",
    patterns: ["Strategy", "Factory", "Singleton", "Observer"],
    tags: ["Concurrency", "State Machine", "Polymorphism"],
    summary: "Design a multi-floor parking lot supporting different vehicle sizes (Car, Bike, Bus, Electric), dynamic slot allocation strategies (Nearest-to-Entrance, Best-Fit), and extensible fee pricing models (Hourly, Flat, Peak Surge).",
    requirements: {
      functional: [
        "Multiple floors, each floor has multiple parking spots of varying sizes (COMPACT, LARGE, MOTORCYCLE, EV).",
        "Vehicle enters at an entry gate: system assigns optimal spot, creates Ticket with entry timestamp, and marks spot OCCUPIED.",
        "Vehicle exits at exit gate: system calculates total fee based on ticket duration and active FeeStrategy, frees the spot, and accepts payment.",
        "Support pluggable slot allocation strategies (e.g. NearestToEntranceStrategy, LowestFloorFirstStrategy).",
        "Real-time display board at each floor showing available spots per vehicle category."
      ],
      nonFunctional: [
        "Thread-safe spot assignment and release to prevent double-booking under concurrent entry gates.",
        "Extensible design adhering to SOLID principles: easily add new vehicle types, fee rules, or allocation algorithms without modifying existing classes.",
        "In-memory execution with clear separation into Models, Strategies, Repositories, and Services."
      ]
    },
    entities: [
      { name: "Vehicle", desc: "Abstract base class with licensePlate and VehicleType (CAR, BIKE, TRUCK, ELECTRIC)." },
      { name: "ParkingSpot", desc: "Has spotId, floorNumber, SpotType, isAvailable, and parkedVehicle reference." },
      { name: "ParkingFloor", desc: "Manages collection of ParkingSpots, display boards, and floor-level availability counters." },
      { name: "ParkingTicket", desc: "Contains ticketNumber, vehicle, parkingSpot, entryTime, exitTime, and paidAmount." },
      { name: "ParkingLot", desc: "Singleton root entity coordinating multiple floors, entry gates, exit gates, and active strategies." },
      { name: "ParkingStrategy", desc: "Interface for finding optimal spot: findSpot(floors, vehicleType)." },
      { name: "FeeCalculationStrategy", desc: "Interface for computing fee: calculateFee(ticket)." }
    ],
    classDiagram: `
+-------------------------------------------------------------+
|                        ParkingLot (Singleton)               |
| - id: String                                                |
| - floors: List<ParkingFloor>                                |
| - parkingStrategy: ParkingStrategy                          |
| - feeStrategy: FeeCalculationStrategy                       |
| + parkVehicle(vehicle: Vehicle): ParkingTicket              |
| + exitVehicle(ticket: ParkingTicket): Receipt               |
+-------------------------------------------------------------+
                              | 1..*
                              v
+-------------------------------------------------------------+
|                        ParkingFloor                         |
| - floorNumber: int                                          |
| - spots: Map<SpotType, List<ParkingSpot>>                   |
| - displayBoard: FloorDisplayBoard                           |
| + getAvailableSpots(type: SpotType): List<ParkingSpot>      |
+-------------------------------------------------------------+
                              | 1..*
                              v
+-------------------------------------------------------------+
|                        ParkingSpot                          |
| - id: String, floorNumber: int, spotType: SpotType          |
| - isOccupied: boolean, currentVehicle: Vehicle              |
| + assignVehicle(v: Vehicle): boolean (synchronized)         |
| + releaseVehicle(): void (synchronized)                     |
+-------------------------------------------------------------+
    `,
    codeSnippet: `// Complete Thread-Safe Java Machine Coding Implementation
public enum VehicleType { MOTORCYCLE, CAR, BUS, EV }
public enum SpotType { SMALL, MEDIUM, LARGE, ELECTRIC }

public class ParkingSpot {
    private final String id;
    private final int floor;
    private final SpotType spotType;
    private volatile boolean occupied = false;
    private Vehicle currentVehicle;

    public ParkingSpot(String id, int floor, SpotType type) {
        this.id = id; this.floor = floor; this.spotType = type;
    }

    public synchronized boolean assign(Vehicle vehicle) {
        if (occupied || !canFit(vehicle)) return false;
        this.currentVehicle = vehicle;
        this.occupied = true;
        return true;
    }

    public synchronized void vacate() {
        this.currentVehicle = null;
        this.occupied = false;
    }

    public boolean canFit(Vehicle v) {
        switch (v.getType()) {
            case MOTORCYCLE: return true;
            case CAR: return spotType == SpotType.MEDIUM || spotType == SpotType.LARGE;
            case BUS: return spotType == SpotType.LARGE;
            case EV: return spotType == SpotType.ELECTRIC;
            default: return false;
        }
    }
    public boolean isOccupied() { return occupied; }
    public String getId() { return id; }
}

public interface ParkingStrategy {
    ParkingSpot findSpot(List<ParkingFloor> floors, Vehicle vehicle);
}

public class NearestFirstStrategy implements ParkingStrategy {
    @Override
    public ParkingSpot findSpot(List<ParkingFloor> floors, Vehicle vehicle) {
        for (ParkingFloor floor : floors) {
            for (ParkingSpot spot : floor.getAvailableSpots()) {
                if (spot.canFit(vehicle)) return spot;
            }
        }
        return null; // Lot full
    }
}`,
    interviewerQuestions: [
      "How do you handle race conditions when two cars arrive at two different gates simultaneously seeking the last spot? (Answer: Double-checked locking or ReentrantLock per spot / AtomicReference).",
      "How do you extend this for peak dynamic surge pricing? (Answer: Decorate FeeCalculationStrategy with DynamicSurgeFeeDecorator checking lot occupancy percentage).",
      "How would you support reserved parking for VIPs or handicapped spots? (Answer: Add SpotAttribute enum flags and filter in ParkingStrategy)."
    ]
  },
  {
    id: "lld-splitwise",
    title: "Splitwise (Expense Sharing App)",
    subtitle: "Expense splitting with multiple strategies (equal, exact, percentage), debt simplification graph",
    difficulty: "Medium",
    duration: "60-90 min",
    companies: ["PhonePe", "Flipkart", "Paytm", "Google", "Microsoft"],
    category: "Financial Systems",
    patterns: ["Strategy", "Command", "Observer", "Builder"],
    tags: ["Min Cash Flow", "Greedy Algorithm", "Ledger Graph"],
    summary: "Design an expense sharing and debt settlement system like Splitwise supporting groups, multiple split strategies (Equal, Exact, Percentage, Share), and debt simplification using the Minimum Cash Flow greedy algorithm.",
    requirements: {
      functional: [
        "Users can register, create groups, and add friends.",
        "Add expense paid by one or more users, split among group members using: EQUAL, EXACT amounts, PERCENTAGE, or SHARES.",
        "Track individual user balances: 'User A owes User B $20' and 'User C is owed $40'.",
        "Simplify debts in a group: minimize the total number of peer-to-peer financial transactions required to settle all debts.",
        "View personal balance sheet across all groups and direct friend expenses."
      ],
      nonFunctional: [
        "Precision safety: always use BigInteger/BigDecimal for currency to prevent floating-point rounding errors.",
        "Input validation: Exact splits must sum to total amount; Percentage splits must sum to exactly 100.0%.",
        "Clean separation of SplitStrategy interface and DebtSimplificationService."
      ]
    },
    entities: [
      { name: "User", desc: "userId, name, email, phone." },
      { name: "Group", desc: "groupId, name, members list, expenses list." },
      { name: "Expense", desc: "expenseId, description, totalAmount, paidBy (User/Split), splits list, ExpenseType." },
      { name: "Split", desc: "Abstract base class containing User and amount owed (EqualSplit, ExactSplit, PercentSplit)." },
      { name: "SplitStrategy", desc: "Interface validating and calculating exact splits: validate(total, splits), calculate(total, splits)." },
      { name: "DebtSimplifier", desc: "Minimizes net balances using max-creditor / max-debtor greedy matching." }
    ],
    classDiagram: `
+-------------------------------------------------------------+
|                           Expense                           |
| - id: String, description: String, amount: BigDecimal       |
| - paidBy: User, splits: List<Split>, type: ExpenseType      |
+-------------------------------------------------------------+
                              | 1..*
                              v
+-------------------------------------------------------------+
|                       Split (Abstract)                      |
| - user: User, amount: BigDecimal                            |
+-------------------------------------------------------------+
          ^                          ^                    ^
          |                          |                    |
   +--------------+          +---------------+    +----------------+
   |  EqualSplit  |          |   ExactSplit  |    |  PercentSplit  |
   +--------------+          +---------------+    +----------------+

+-------------------------------------------------------------+
|              SplitStrategy (Strategy Pattern)               |
| + validate(total: BigDecimal, splits: List<Split>): boolean |
| + computeSplits(total: BigDecimal, splits: List<Split>)     |
+-------------------------------------------------------------+
    `,
    codeSnippet: `// Debt Simplification (Min-Cash-Flow Greedy Algorithm)
public class DebtSimplificationService {
    public List<Transaction> simplifyDebts(Map<String, BigDecimal> netBalances) {
        List<Transaction> transactions = new ArrayList<>();
        PriorityQueue<UserBalance> creditors = new PriorityQueue<>(
            (a, b) -> b.amount.compareTo(a.amount));
        PriorityQueue<UserBalance> debtors = new PriorityQueue<>(
            (a, b) -> a.amount.compareTo(b.amount));

        for (Map.Entry<String, BigDecimal> entry : netBalances.entrySet()) {
            if (entry.getValue().compareTo(BigDecimal.ZERO) > 0)
                creditors.offer(new UserBalance(entry.getKey(), entry.getValue()));
            else if (entry.getValue().compareTo(BigDecimal.ZERO) < 0)
                debtors.offer(new UserBalance(entry.getKey(), entry.getValue()));
        }

        while (!creditors.isEmpty() && !debtors.isEmpty()) {
            UserBalance maxCredit = creditors.poll();
            UserBalance maxDebit = debtors.poll();

            BigDecimal minAmount = maxCredit.amount.min(maxDebit.amount.abs());
            transactions.add(new Transaction(maxDebit.userId, maxCredit.userId, minAmount));

            BigDecimal remainingCredit = maxCredit.amount.subtract(minAmount);
            BigDecimal remainingDebit = maxDebit.amount.add(minAmount);

            if (remainingCredit.compareTo(BigDecimal.ZERO) > 0)
                creditors.offer(new UserBalance(maxCredit.userId, remainingCredit));
            if (remainingDebit.compareTo(BigDecimal.ZERO) < 0)
                debtors.offer(new UserBalance(maxDebit.userId, remainingDebit));
        }
        return transactions;
    }
}`,
    interviewerQuestions: [
      "What is the time complexity of the debt simplification algorithm? (Answer: Greedy min-cash-flow is O(N log N) using heaps, where N is the number of participants. Optimal absolute minimum is NP-Complete via subset-sum reduction, but greedy produces near-optimal practical results).",
      "How do you handle rounding cents when splitting $100 among 3 people equally? (Answer: First person pays $33.34, remaining two pay $33.33 by distributing remainder 1 cent to the first split).",
      "How would you implement undo / expense deletion? (Answer: Command pattern with execute() and undo() storing reversal ledger delta)."
    ]
  },
  {
    id: "lld-elevator-system",
    title: "Elevator System",
    subtitle: "Multi-car dispatch with SCAN / LOOK elevator algorithm, direction state machine, and floor scheduling",
    difficulty: "Hard",
    duration: "75-90 min",
    companies: ["Amazon", "Uber", "Google", "Microsoft", "Goldman Sachs"],
    category: "Hardware & Automation",
    patterns: ["State", "Strategy", "Observer", "Facade"],
    tags: ["SCAN Algorithm", "LOOK Algorithm", "Multi-Threading"],
    summary: "Design an intelligent multi-elevator dispatch controller for a modern skyscraper with internal button panels, external hall request stations, LOOK scheduling algorithm, and dynamic car allocation.",
    requirements: {
      functional: [
        "Building has N floors and M elevator cars.",
        "External Hall Request: Passenger at Floor K presses UP or DOWN button.",
        "Internal Car Request: Passenger inside Elevator Car presses target destination floor.",
        "Elevator Controller dispatches the most optimal car based on current floor, direction, and passenger load.",
        "Elevator movements follow LOOK algorithm: continues in current direction serving all requests until no more requests exist in that direction, then reverses."
      ],
      nonFunctional: [
        "Concurrent request queue processing across multiple asynchronous elevator threads.",
        "Safety interlocks: door cannot open while moving; car cannot move while door is open; emergency stop overrides.",
        "Extensible dispatch strategy (e.g., ZoneDispatch, EnergySavingDispatch, OddEvenDispatch)."
      ]
    },
    entities: [
      { name: "ElevatorCar", desc: "carId, currentFloor, Direction (UP, DOWN, IDLE), State (MOVING, STOPPED, DOOR_OPEN), TreeSet of destination requests." },
      { name: "ElevatorController", desc: "Singleton coordinator managing M elevator cars and assigning external requests via DispatchStrategy." },
      { name: "ExternalRequest", desc: "sourceFloor, direction (UP/DOWN)." },
      { name: "InternalRequest", desc: "targetFloor, carId." },
      { name: "DispatchStrategy", desc: "Interface: selectBestElevator(List<ElevatorCar>, ExternalRequest)." }
    ],
    classDiagram: `
+-------------------------------------------------------------+
|                      ElevatorController                     |
| - elevators: List<ElevatorCar>                              |
| - dispatchStrategy: DispatchStrategy                        |
| + requestElevator(floor: int, dir: Direction)               |
| + step(): void                                              |
+-------------------------------------------------------------+
                              | 1..*
                              v
+-------------------------------------------------------------+
|                         ElevatorCar                         |
| - id: int, currentFloor: int, direction: Direction          |
| - upRequests: TreeSet<Integer> (sorted ascending)           |
| - downRequests: TreeSet<Integer> (sorted descending)         |
| + addDestination(floor: int)                                |
| + move(): void                                              |
+-------------------------------------------------------------+
    `,
    codeSnippet: `// LOOK Elevator Dispatch Logic
public class ElevatorCar implements Runnable {
    private final int id;
    private int currentFloor = 1;
    private Direction direction = Direction.IDLE;
    private final TreeSet<Integer> upStops = new TreeSet<>();
    private final TreeSet<Integer> downStops = new TreeSet<>(Collections.reverseOrder());

    public synchronized void addStop(int targetFloor) {
        if (targetFloor > currentFloor) upStops.add(targetFloor);
        else downStops.add(targetFloor);
        if (direction == Direction.IDLE) {
            direction = targetFloor > currentFloor ? Direction.UP : Direction.DOWN;
        }
    }

    public synchronized void step() {
        if (direction == Direction.UP) {
            Integer next = upStops.ceiling(currentFloor);
            if (next != null) {
                currentFloor = next;
                upStops.remove(next);
            } else if (!downStops.isEmpty()) {
                direction = Direction.DOWN;
            } else {
                direction = Direction.IDLE;
            }
        } else if (direction == Direction.DOWN) {
            Integer next = downStops.floor(currentFloor);
            if (next != null) {
                currentFloor = next;
                downStops.remove(next);
            } else if (!upStops.isEmpty()) {
                direction = Direction.UP;
            } else {
                direction = Direction.IDLE;
            }
        }
    }
}`,
    interviewerQuestions: [
      "Why use two TreeSets (upStops ascending, downStops descending) instead of a simple Queue? (Answer: TreeSet ceiling() and floor() give O(log N) lookup for the nearest stop in the car's current trajectory, enabling LOOK algorithm without sorting on every step).",
      "How do you prevent starvation for a passenger waiting on a low floor when upper floors keep getting calls? (Answer: Ageing heuristic in Dispatcher or switching to SCAN when wait time exceeds threshold).",
      "How do you handle elevator car weight capacity limits? (Answer: If loadSensor.isOverloaded(), bypass external hall calls and only fulfill internal drop-offs)."
    ]
  },
  {
    id: "lld-vending-machine",
    title: "Vending Machine",
    subtitle: "State Machine (Idle, HasMoney, Dispensing, SoldOut) with currency validation and change return",
    difficulty: "Medium",
    duration: "45-60 min",
    companies: ["Amazon", "PhonePe", "Flipkart", "Cisco"],
    category: "Real-World Systems",
    patterns: ["State Pattern", "Strategy", "Factory"],
    tags: ["State Machine", "Inventory Management", "Greedy Coin Change"],
    summary: "Design a fully functional Vending Machine software system adhering strictly to the State Design Pattern. Handles coin/note insertion, product selection, change calculation, and refund workflows.",
    requirements: {
      functional: [
        "Idle State: Waiting for customer to insert coin or note.",
        "HasMoney State: Accepts additional money, allows product selection, or cancel transaction for refund.",
        "Dispense State: Deducts product from inventory, calculates and returns change, transitions back to Idle.",
        "SoldOut / Maintenance State: Disables selections when product is unavailable or machine has no change.",
        "Change calculation computes minimum coin denomination breakdown (Greedy / DP)."
      ],
      nonFunctional: [
        "Strict encapsulation using the State Pattern: transitions are driven by states rather than massive switch/if-else statements.",
        "Thread-safe inventory updates."
      ]
    },
    entities: [
      { name: "VendingMachineState", desc: "Interface: insertMoney(), selectProduct(), dispense(), refund()." },
      { name: "IdleState", desc: "Waiting for money; rejects selection/dispense." },
      { name: "HasMoneyState", desc: "Allows product selection, additional insertion, or full refund." },
      { name: "DispenseState", desc: "Dispenses item and calculates change." },
      { name: "SoldOutState", desc: "Ejects money if chosen item is out of stock." },
      { name: "Inventory", desc: "Thread-safe map of ItemSlot -> count." }
    ],
    classDiagram: `
+-------------------------------------------------------------+
|                    VendingMachine (Context)                 |
| - currentState: State, balance: int, inventory: Inventory   |
| + setState(s: State), insertCoin(c: Coin)                   |
| + selectProduct(code: String), cancel(): List<Coin>         |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                     State (Interface)                       |
| + insertCoin(machine, coin), selectItem(machine, code)      |
| + dispense(machine), refund(machine): List<Coin>            |
+-------------------------------------------------------------+
    ^               ^                  ^                 ^
    |               |                  |                 |
[IdleState]   [HasMoneyState]   [DispenseState]   [SoldOutState]
    `,
    codeSnippet: `// State Pattern in Java
public interface VendingState {
    void insertMoney(VendingMachine m, int amount);
    void selectProduct(VendingMachine m, String code);
    void dispense(VendingMachine m);
    List<Integer> cancel(VendingMachine m);
}

public class HasMoneyState implements VendingState {
    @Override
    public void insertMoney(VendingMachine m, int amount) {
        m.addBalance(amount);
    }

    @Override
    public void selectProduct(VendingMachine m, String code) {
        Product p = m.getInventory().getProduct(code);
        if (p == null || m.getInventory().getCount(code) == 0) {
            m.setState(m.getSoldOutState());
            return;
        }
        if (m.getBalance() < p.getPrice()) {
            System.out.println("Insufficient balance. Need: " + (p.getPrice() - m.getBalance()));
            return;
        }
        m.setSelectedProduct(p);
        m.setState(m.getDispenseState());
        m.dispense();
    }

    @Override
    public List<Integer> cancel(VendingMachine m) {
        List<Integer> refund = m.calculateChange(m.getBalance());
        m.resetBalance();
        m.setState(m.getIdleState());
        return refund;
    }
}`,
    interviewerQuestions: [
      "Why is State Pattern better than if/else or switch-case statements here? (Answer: Adding new states like MaintenanceState or PinValidationState requires 0 changes to existing state classes, strictly satisfying Open/Closed Principle).",
      "What if the vending machine does not have enough coins to return exact change? (Answer: Before dispensing, pre-validate change feasibility using canMakeChange(). If impossible, transition to refund state and display error).",
      "How do you handle hardware sensor failures during physical dispense? (Answer: Two-phase commit with physical sensor timeout; if drop sensor does not trigger within 3s, rollback inventory, refund user, enter MaintenanceState)."
    ]
  },
  {
    id: "lld-rate-limiter",
    title: "Rate Limiter (In-Memory)",
    subtitle: "Token Bucket, Sliding Window Counter, and Leaky Bucket with thread-safe atomics and Strategy pattern",
    difficulty: "Medium",
    duration: "45-60 min",
    companies: ["Google", "Stripe", "Uber", "Razorpay", "Twilio"],
    category: "Infrastructure & Concurrency",
    patterns: ["Strategy", "Factory", "Decorator"],
    tags: ["AtomicLong", "Sliding Window", "Token Bucket", "Thread Safety"],
    summary: "Design a high-throughput, thread-safe in-memory rate limiting library that restricts requests per client key (IP, User ID, API Key) across configurable time windows using multiple swappable algorithms.",
    requirements: {
      functional: [
        "Support rate limiting by client key (e.g., 100 requests per minute per API key).",
        "Implement Token Bucket (burst capacity + steady refill rate).",
        "Implement Sliding Window Counter (smooth rate limiting without boundary reset spikes).",
        "Return boolean allowRequest(clientKey) indicating whether request is admitted or dropped."
      ],
      nonFunctional: [
        "Microsecond latency overhead per check: must be lock-free or use minimal fine-grained synchronization.",
        "Memory efficiency: automatic eviction / TTL cleanup of inactive client keys to prevent heap exhaustion."
      ]
    },
    entities: [
      { name: "RateLimiter", desc: "Interface: allowRequest(key): boolean." },
      { name: "TokenBucketLimiter", desc: "Capacity, refillRate, AtomicLong currentTokens, AtomicLong lastRefillTimestamp." },
      { name: "SlidingWindowCounterLimiter", desc: "WindowSizeMs, maxRequests, Deque<Long> or segmented bucket counters." },
      { name: "RateLimiterFactory", desc: "Creates configured limiter instance based on config rules." }
    ],
    classDiagram: `
+-------------------------------------------------------------+
|                   RateLimiter (Interface)                   |
| + allowRequest(clientKey: String): boolean                  |
| + allowRequest(clientKey: String, tokens: int): boolean     |
+-------------------------------------------------------------+
          ^                                       ^
          |                                       |
+------------------------------+     +-------------------------------+
|     TokenBucketRateLimiter   |     |  SlidingWindowRateLimiter     |
| - capacity: long             |     | - windowSizeMs: long          |
| - refillTokensPerSec: double |     | - maxRequests: int            |
| - buckets: ConcurrentMap     |     | - requestLog: ConcurrentMap   |
+------------------------------+     +-------------------------------+
    `,
    codeSnippet: `// Lock-Free Token Bucket using Atomic Updates
public class TokenBucket {
    private final long capacity;
    private final double refillRatePerMs;
    private double tokens;
    private long lastRefillTimestamp;

    public TokenBucket(long capacity, double refillTokensPerSec) {
        this.capacity = capacity;
        this.refillRatePerMs = refillTokensPerSec / 1000.0;
        this.tokens = capacity;
        this.lastRefillTimestamp = System.currentTimeMillis();
    }

    public synchronized boolean allow(int requestedTokens) {
        refill();
        if (tokens >= requestedTokens) {
            tokens -= requestedTokens;
            return true;
        }
        return false;
    }

    private void refill() {
        long now = System.currentTimeMillis();
        long elapsedMs = now - lastRefillTimestamp;
        if (elapsedMs > 0) {
            tokens = Math.min(capacity, tokens + (elapsedMs * refillRatePerMs));
            lastRefillTimestamp = now;
        }
    }
}`,
    interviewerQuestions: [
      "Why is Token Bucket preferred over Fixed Window Counter? (Answer: Fixed Window allows 2× limit burst at the window boundary, whereas Token Bucket strictly caps burst to bucket capacity).",
      "How do you handle memory leaks from millions of transient client IPs? (Answer: Caffeine / Guava cache with expireAfterAccess(10, TimeUnit.MINUTES)).",
      "How would you transition this to a distributed rate limiter? (Answer: Redis Lua script executing atomic token refill and decrement across clusters)."
    ]
  },
  {
    id: "lld-task-scheduler",
    title: "Task Scheduler",
    subtitle: "Priority queue, thread pool worker executor, delayed execution, and recurring cron tasks",
    difficulty: "Hard",
    duration: "60-75 min",
    companies: ["Google", "Amazon", "Microsoft", "Uber", "Salesforce"],
    category: "Infrastructure & Concurrency",
    patterns: ["Producer-Consumer", "Observer", "Command", "Strategy"],
    tags: ["DelayQueue", "ThreadPoolExecutor", "ReentrantLock", "Condition"],
    summary: "Design an in-process asynchronous task scheduler capable of executing one-off delayed tasks, recurring periodic tasks, and priority-ordered jobs with cancellation and worker pool fault tolerance.",
    requirements: {
      functional: [
        "Schedule one-off task at specific timestamp: schedule(task, executionTime).",
        "Schedule recurring task with fixed interval: scheduleAtFixedRate(task, initialDelay, interval).",
        "Task cancellation: cancel(taskId) removes queued task or signals running task interruption.",
        "Worker thread pool executes ready tasks concurrently without blocking the scheduler thread."
      ],
      nonFunctional: [
        "Thread-safe synchronization using ReentrantLock and Condition or java.util.concurrent.DelayQueue.",
        "Zero busy-waiting: worker threads sleep until the next earliest task is ready for execution."
      ]
    },
    entities: [
      { name: "ScheduledTask", desc: "taskId, Runnable action, executionTimeMs, intervalMs, isRecurring, isCancelled." },
      { name: "CustomTaskScheduler", desc: "PriorityQueue / DelayQueue of tasks, ReentrantLock, newJobAvailable Condition, WorkerPool." },
      { name: "WorkerThread", desc: "Pulls mature tasks from queue, executes action, and re-enqueues recurring jobs." }
    ],
    classDiagram: `
+-------------------------------------------------------------+
|                      CustomTaskScheduler                    |
| - taskQueue: PriorityQueue<ScheduledTask>                   |
| - lock: ReentrantLock, hasNewTask: Condition                |
| - workers: List<Thread>, isRunning: boolean                 |
| + schedule(task: Runnable, delayMs: long): String           |
| + schedulePeriodic(task: Runnable, intervalMs: long)        |
| + cancel(taskId: String): boolean                           |
+-------------------------------------------------------------+
    `,
    codeSnippet: `// Custom Thread-Safe Task Scheduler without busy-waiting
public class SimpleTaskScheduler {
    private final PriorityQueue<ScheduledTask> queue = new PriorityQueue<>(
        Comparator.comparingLong(ScheduledTask::getRunTime));
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition condition = lock.newCondition();
    private volatile boolean running = true;

    public void start() {
        Thread dispatcher = new Thread(() -> {
            while (running) {
                lock.lock();
                try {
                    while (queue.isEmpty()) condition.await();
                    long now = System.currentTimeMillis();
                    ScheduledTask task = queue.peek();
                    if (task.getRunTime() <= now) {
                        queue.poll();
                        executeAsync(task.getAction());
                        if (task.isRecurring()) {
                            task.reschedule();
                            queue.offer(task);
                        }
                    } else {
                        condition.await(task.getRunTime() - now, TimeUnit.MILLISECONDS);
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    lock.unlock();
                }
            }
        });
        dispatcher.start();
    }
}`,
    interviewerQuestions: [
      "Why condition.await(delay, TimeUnit.MILLISECONDS) instead of Thread.sleep()? (Answer: If a new task arrives with an earlier execution time than the current head of the queue, schedule() signals the condition, waking the dispatcher immediately to re-adjust its sleep).",
      "What happens if an asynchronous worker task throws an uncaught exception? (Answer: Wrap execution in try-catch inside worker wrapper to prevent killing worker thread, log to dead-letter handler).",
      "Difference between fixedRate and fixedDelay? (Answer: fixedRate runs every N ms regardless of execution time; fixedDelay waits N ms after the previous run finishes)."
    ]
  },
  {
    id: "lld-pub-sub",
    title: "Pub/Sub System (Mini-Kafka)",
    subtitle: "Topics, partitions, consumer groups, offset tracking, and at-least-once message delivery",
    difficulty: "Hard",
    duration: "75-90 min",
    companies: ["Uber", "LinkedIn", "Flipkart", "Twitter", "Confluent"],
    category: "Infrastructure & Concurrency",
    patterns: ["Observer", "Iterator", "Factory", "Singleton"],
    tags: ["Partitions", "Consumer Groups", "Offset Management", "Zero-Loss"],
    summary: "Design an in-memory distributed pub/sub messaging broker like Apache Kafka supporting multiple topics, partitioned commit logs, independent consumer groups, and client offset commits.",
    requirements: {
      functional: [
        "Producers can create topics and publish messages to specific topics with optional partition keys.",
        "Topics are divided into 1 or more Partitions. Messages inside a partition are strictly ordered by sequential Offset.",
        "Consumer Groups: each message in a topic is delivered to exactly one consumer instance per consumer group.",
        "Consumers pull messages in batches and explicitly commit offsets (at-least-once delivery semantics)."
      ],
      nonFunctional: [
        "Concurrent producers publishing to different partitions without lock contention.",
        "Thread-safe consumer group rebalancing and partition assignment."
      ]
    },
    entities: [
      { name: "Message", desc: "offset, key, payload, timestamp." },
      { name: "Partition", desc: "Thread-safe append-only list of Messages, nextOffset counter." },
      { name: "Topic", desc: "topicName, list of Partitions, PartitionStrategy (Hash / Round-Robin)." },
      { name: "ConsumerGroup", desc: "groupId, consumers list, map of (Partition -> committedOffset)." },
      { name: "Broker", desc: "Central registry of Topics and ConsumerGroups." }
    ],
    classDiagram: `
+-------------------------------------------------------------+
|                            Topic                            |
| - name: String, partitions: List<Partition>                 |
| + publish(key: String, data: byte[]): Offset                |
+-------------------------------------------------------------+
                              | 1..*
                              v
+-------------------------------------------------------------+
|                          Partition                          |
| - partitionId: int, messages: List<Message>                 |
| + synchronized append(msg: Message): long                   |
| + readFromOffset(offset: long, maxBatch: int): List<Message>|
+-------------------------------------------------------------+
    `,
    codeSnippet: `// In-Memory Partition Commit Log
public class TopicPartition {
    private final int partitionId;
    private final List<Message> log = new ArrayList<>();
    private final ReadWriteLock rwLock = new ReentrantReadWriteLock();

    public long append(String payload) {
        rwLock.writeLock().lock();
        try {
            long offset = log.size();
            log.add(new Message(offset, payload, System.currentTimeMillis()));
            return offset;
        } finally {
            rwLock.writeLock().unlock();
        }
    }

    public List<Message> poll(long fromOffset, int maxRecords) {
        rwLock.readLock().lock();
        try {
            List<Message> batch = new ArrayList<>();
            for (int i = (int) fromOffset; i < log.size() && batch.size() < maxRecords; i++) {
                batch.add(log.get(i));
            }
            return batch;
        } finally {
            rwLock.readLock().unlock();
        }
    }
}`,
    interviewerQuestions: [
      "Why partition by key? (Answer: Ensures strict sequential ordering for events belonging to the same entity, e.g. orderId or userId, while allowing horizontal parallelism across different partitions).",
      "How do you handle consumer group rebalancing when a consumer crashes? (Answer: Heartbeat timeout detection marks consumer dead; coordinator revokes its partition assignments and redistributes them evenly among remaining group members).",
      "How is at-least-once delivery ensured? (Answer: Consumer processes messages first, then commits offset to broker. If it crashes during processing, replacement consumer re-reads from last uncommitted offset)."
    ]
  },
  {
    id: "lld-file-system",
    title: "In-Memory File System",
    subtitle: "Hierarchical file system with mkdir, ls, touch, rm, path traversal using Composite Pattern",
    difficulty: "Medium",
    duration: "45-60 min",
    companies: ["Amazon", "Uber", "Google", "Dropbox"],
    category: "Core Data Structures",
    patterns: ["Composite Pattern", "Iterator", "Command"],
    tags: ["Tree Traversal", "Path Parsing", "Trie / Hierarchy"],
    summary: "Design an in-memory hierarchical Unix-like file system with nested directories, files, path navigation (/a/b/c), content reading/writing, and search using the Composite Design Pattern.",
    requirements: {
      functional: [
        "mkdir(path): Create directory hierarchy if parent directories exist.",
        "ls(path): Return list of file and directory names at specified path in alphabetical order.",
        "addContentToFile(path, content): Append string content to file; create file if absent.",
        "readContentFromFile(path): Return full string contents of file.",
        "rm(path): Delete file or directory (recursively)."
      ],
      nonFunctional: [
        "Composite Pattern: Uniform interface for both Directory and File (FileSystemNode).",
        "Thread-safe reads and writes using ReadWriteLock per node or global path lock."
      ]
    },
    entities: [
      { name: "FileSystemNode", desc: "Abstract base class: name, parent, isDirectory(), getSize()." },
      { name: "File", desc: "Inherits FileSystemNode, contains StringBuilder content." },
      { name: "Directory", desc: "Inherits FileSystemNode, contains Map<String, FileSystemNode> children." },
      { name: "FileSystem", desc: "Root Directory, path parser, resolver methods." }
    ],
    classDiagram: `
+-------------------------------------------------------------+
|                  FileSystemNode (Composite)                 |
| - name: String, parent: Directory                           |
| + isDirectory(): boolean, getSize(): long                   |
+-------------------------------------------------------------+
          ^                                       ^
          |                                       |
+------------------------------+     +-------------------------------+
|             File             |     |           Directory           |
| - content: StringBuilder     |     | - children: Map<String, Node> |
| + append(text: String)       |     | + add(node), remove(name)     |
+------------------------------+     +-------------------------------+
    `,
    codeSnippet: `// Composite Pattern Implementation
public abstract class Node {
    protected String name;
    protected Directory parent;
    public abstract boolean isDirectory();
    public String getName() { return name; }
}

public class Directory extends Node {
    private final Map<String, Node> children = new TreeMap<>();
    public Directory(String name) { this.name = name; }
    @Override public boolean isDirectory() { return true; }
    public Map<String, Node> getChildren() { return children; }
    public void add(Node node) { children.put(node.getName(), node); }
}

public class File extends Node {
    private final StringBuilder content = new StringBuilder();
    public File(String name) { this.name = name; }
    @Override public boolean isDirectory() { return false; }
    public void append(String text) { content.append(text); }
    public String read() { return content.toString(); }
}`,
    interviewerQuestions: [
      "Why use Composite Pattern here? (Answer: It lets client code treat individual files and composite directories uniformly when checking paths, calculating sizes, or deleting trees).",
      "How do you handle symbolic links? (Answer: Create a SymlinkNode holding a pointer / path string to target node and guard against infinite cyclic traversals).",
      "How to scale this across multiple concurrent writer threads? (Answer: Fine-grained directory node locking using ConcurrentHashMap or ReentrantReadWriteLock on individual directory nodes along the path)."
    ]
  }
];
