/* =====================================================
   LAMP LIFE
   Personal Daily Mission Dashboard
===================================================== */

const DB_KEY = "lampLife_database_v4";
const SESSION_KEY = "lampLife_current_user";


/* =====================================================
   DATE HELPERS
===================================================== */

const dayNames = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY"
];

const shortDays = [
    "SUN",
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT"
];

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


function dateKey(date) {

    const y = date.getFullYear();

    const m = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const d = String(
        date.getDate()
    ).padStart(2, "0");

    return `${y}-${m}-${d}`;
}


function cloneDate(date) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );
}


function addDays(date, amount) {

    const d = cloneDate(date);

    d.setDate(
        d.getDate() + amount
    );

    return d;
}


function mondayOfWeek(date) {

    const d = cloneDate(date);

    const day = d.getDay();

    const diff =
        day === 0
            ? -6
            : 1 - day;

    d.setDate(
        d.getDate() + diff
    );

    return d;
}


function formatDate(date) {

    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}


/* =====================================================
   DATABASE
===================================================== */

function getDatabase() {

    try {

        return JSON.parse(
            localStorage.getItem(DB_KEY)
        ) || {
            accounts: {},
            users: {}
        };

    } catch {

        return {
            accounts: {},
            users: {}
        };
    }
}


function saveDatabase(db) {

    localStorage.setItem(
        DB_KEY,
        JSON.stringify(db)
    );
}


let currentUser = null;
let selectedDate = new Date();


/* =====================================================
   DEFAULT WEEKLY SCHEDULE
===================================================== */

const schedule = {

    MONDAY: [

        {
            time: "6:15 – 7:15 AM",
            title: "Chest + Core + 3 km",
            description:
                "Push-ups • Wide push-ups • Diamond push-ups • Leg raises • Mountain climbers • Hollow hold • Plank • 3 km jog",
            category: "Fitness"
        },

        {
            time: "7:15 – 8:15 AM",
            title: "Bath + Breakfast + Get Ready",
            description: "Prepare for college.",
            category: "Personal"
        },

        {
            time: "9:51 – 11:30 AM",
            title: "Effective English Communication",
            description: "ELA • TT306",
            category: "College"
        },

        {
            time: "11:40 AM – 1:20 PM",
            title: "Engineering Physics",
            description: "ELA • PRPG17",
            category: "College"
        },

        {
            time: "2:00 – 3:00 PM",
            title: "CAT — QA",
            description:
                "Number System • Percentages • Ratio • Averages • Profit & Loss",
            category: "CAT"
        },

        {
            time: "4:00 – 4:50 PM",
            title: "BEEE",
            description: "ETH • PRPG25",
            category: "College"
        },

        {
            time: "6:00 – 6:50 PM",
            title: "Multivariable Calculus",
            description: "ETH • PRPG25",
            category: "College"
        },

        {
            time: "7:30 – 8:15 PM",
            title: "AI Learning",
            description:
                "What is AI? • ML vs AI • Deep Learning • Generative AI • LLMs",
            category: "AI / Skill"
        },

        {
            time: "8:15 – 9:00 PM",
            title: "Dinner + Relax",
            description: "Take a proper break.",
            category: "Personal"
        },

        {
            time: "9:00 – 9:30 PM",
            title: "College Revision",
            description: "Review today's college topics.",
            category: "College"
        }

    ],


    TUESDAY: [

        {
            time: "6:00 – 6:40 AM",
            title: "Legs + Hip",
            description:
                "Squats • Reverse lunges • Sumo squats • Glute bridge • Side leg raises",
            category: "Fitness"
        },

        {
            time: "8:00 – 9:40 AM",
            title: "Engineering Chemistry",
            description: "ELA • SMVG027",
            category: "College"
        },

        {
            time: "11:40 AM – 1:20 PM",
            title: "Multivariable Calculus",
            description: "ELA • PRP445",
            category: "College"
        },

        {
            time: "3:00 – 3:50 PM",
            title: "Multivariable Calculus",
            description: "ETH • PRPG25",
            category: "College"
        },

        {
            time: "4:00 – 4:50 PM",
            title: "Engineering Chemistry",
            description: "ETH • PRPG25",
            category: "College"
        },

        {
            time: "5:00 – 5:50 PM",
            title: "Engineering Physics",
            description: "ETH • PRPG25",
            category: "College"
        },

        {
            time: "7:00 – 8:00 PM",
            title: "Badminton",
            description: "Recreation + movement.",
            category: "Fitness"
        },

        {
            time: "8:30 – 9:15 PM",
            title: "Finance Learning",
            description:
                "Educational basics: shares, markets, risk and personal finance.",
            category: "Finance Learning"
        }

    ],


    WEDNESDAY: [

        {
            time: "6:00 – 6:40 AM",
            title: "Core",
            description:
                "Leg raises • Reverse crunches • Bicycle crunches • Hollow hold • Plank",
            category: "Fitness"
        },

        {
            time: "8:00 – 9:40 AM",
            title: "Problem Solving using Python",
            description: "LO • PRP356",
            category: "College"
        },

        {
            time: "10:30 – 11:15 AM",
            title: "CAT — VARC",
            description:
                "Reading Comprehension • Vocabulary • Verbal Ability",
            category: "CAT"
        },

        {
            time: "2:00 – 2:50 PM",
            title: "Engineering Physics",
            description: "ETH • PRPG25",
            category: "College"
        },

        {
            time: "3:00 – 4:00 PM",
            title: "AI Simulations / Coding",
            description:
                "Python • NumPy • Pandas • Data Analysis • AI basics",
            category: "AI / Skill"
        },

        {
            time: "5:00 – 5:50 PM",
            title: "BEEE",
            description: "ETH • PRPG25",
            category: "College"
        },

        {
            time: "7:00 – 7:40 PM",
            title: "Shuttle Training",
            description: "Short conditioning session.",
            category: "Fitness"
        }

    ],


    THURSDAY: [

        {
            time: "6:15 – 7:15 AM",
            title: "Chest + Pull-ups",
            description:
                "Push-ups • Wide push-ups • Pike push-ups • Pull-ups / assisted pull-ups",
            category: "Fitness"
        },

        {
            time: "9:51 – 11:30 AM",
            title: "BEEE",
            description: "ELA • SJT520",
            category: "College"
        },

        {
            time: "11:40 AM – 1:20 PM",
            title: "Problem Solving using Python",
            description: "LO • PRPG356",
            category: "College"
        },

        {
            time: "2:00 – 2:50 PM",
            title: "BEEE",
            description: "ETH • PRPG25",
            category: "College"
        },

        {
            time: "4:00 – 4:50 PM",
            title: "Multivariable Calculus",
            description: "ETH • PRPG25",
            category: "College"
        },

        {
            time: "5:00 – 5:50 PM",
            title: "Engineering Chemistry",
            description: "ETH • PRPG25",
            category: "College"
        },

        {
            time: "7:30 – 8:15 PM",
            title: "Money-Making Skill",
            description:
                "Python + AI automation + communication + building useful skills",
            category: "AI / Skill"
        }

    ],


    FRIDAY: [

        {
            time: "7:00 – 8:00 AM",
            title: "Full Body",
            description:
                "Moderate full-body movement and mobility.",
            category: "Fitness"
        },

        {
            time: "9:00 – 10:00 AM",
            title: "CAT — DILR",
            description:
                "Data Interpretation • Logical Reasoning",
            category: "CAT"
        },

        {
            time: "11:40 AM – 1:20 PM",
            title: "Effective English Communication",
            description: "LO • TT306",
            category: "College"
        },

        {
            time: "2:00 – 2:50 PM",
            title: "Engineering Chemistry",
            description: "ETH • PRPG25",
            category: "College"
        },

        {
            time: "3:00 – 3:50 PM",
            title: "Engineering Physics",
            description: "ETH • PRPG25",
            category: "College"
        },

        {
            time: "5:00 – 6:00 PM",
            title: "AI Project",
            description:
                "Build something small instead of only watching tutorials.",
            category: "AI / Skill"
        }

    ],


    SATURDAY: [

        {
            time: "7:00 – 8:00 AM",
            title: "3 km Jog + Shuttle",
            description:
                "Moderate cardio and movement.",
            category: "Fitness"
        },

        {
            time: "9:00 – 10:30 AM",
            title: "CAT Full Practice",
            description:
                "Rotate QA • VARC • DILR.",
            category: "CAT"
        },

        {
            time: "11:00 AM – 12:00 PM",
            title: "Finance Learning",
            description:
                "Learn investing concepts, risk and market basics.",
            category: "Finance Learning"
        },

        {
            time: "3:00 – 4:30 PM",
            title: "AI / Coding",
            description:
                "Practice Python and build a small project.",
            category: "AI / Skill"
        },

        {
            time: "5:00 – 6:00 PM",
            title: "Badminton",
            description: "Recreation + movement.",
            category: "Fitness"
        },

        {
            time: "8:00 – 8:30 PM",
            title: "Weekly Review",
            description:
                "Check what you completed and plan the next week.",
            category: "Personal"
        }

    ],


    SUNDAY: [

        {
            time: "7:00 – 7:30 AM",
            title: "Walk + Stretching",
            description: "Easy recovery movement.",
            category: "Fitness"
        },

        {
            time: "10:00 – 11:00 AM",
            title: "CAT Revision",
            description:
                "Revise weak areas from the week.",
            category: "CAT"
        },

        {
            time: "11:00 – 11:45 AM",
            title: "Finance / Money Learning",
            description:
                "Educational learning about personal finance and investing.",
            category: "Finance Learning"
        },

        {
            time: "5:00 – 6:00 PM",
            title: "Plan Next Week",
            description:
                "Set goals, review college work and prepare the week.",
            category: "Personal"
        }

    ]

};


/* =====================================================
   USER DATA
===================================================== */

function getUserData() {

    const db = getDatabase();

    if (!currentUser) {
        return null;
    }

    if (!db.users[currentUser]) {

        db.users[currentUser] = {
            days: {}
        };

        saveDatabase(db);
    }

    return db.users[currentUser];
}


function getDayData(key) {

    const db = getDatabase();

    if (!db.users[currentUser]) {

        db.users[currentUser] = {
            days: {}
        };
    }

    if (!db.users[currentUser].days[key]) {

        db.users[currentUser].days[key] = {
            states: {},
            customTasks: [],
            reflection: "",
            photo: ""
        };

        saveDatabase(db);
    }

    return db.users[currentUser].days[key];
}


function saveDayData(key, data) {

    const db = getDatabase();

    db.users[currentUser].days[key] = data;

    saveDatabase(db);
}


/* =====================================================
   TASK GENERATION
===================================================== */

function getTasksForDate(date) {

    const key = dateKey(date);

    const weekday =
        dayNames[date.getDay()];

    const defaults =
        schedule[weekday] || [];

    const dayData =
        getDayData(key);

    const tasks = defaults.map(
        (task, index) => {

            return {
                id: `default-${index}`,

                time: task.time,

                title: task.title,

                description: task.description,

                category: task.category,

                custom: false,

                state:
                    dayData.states[
                        `default-${index}`
                    ] || "pending"
            };
        }
    );


    const custom =
        dayData.customTasks || [];

    custom.forEach(task => {

        tasks.push({

            ...task,

            custom: true,

            state:
                dayData.states[
                    task.id
                ] || "pending"

        });

    });

    return tasks;
}


/* =====================================================
   PROGRESS
===================================================== */

function getProgress(date) {

    const tasks =
        getTasksForDate(date);

    if (tasks.length === 0) {

        return {
            percent: 0,
            done: 0,
            wrong: 0,
            total: 0
        };
    }

    const done =
        tasks.filter(
            t => t.state === "done"
        ).length;

    const wrong =
        tasks.filter(
            t => t.state === "wrong"
        ).length;

    return {

        percent:
            Math.round(
                (done / tasks.length) * 100
            ),

        done,

        wrong,

        total: tasks.length
    };
}


/* =====================================================
   LANDING STARS
===================================================== */

function createStars() {

    const container =
        document.getElementById("stars");

    for (let i = 0; i < 100; i++) {

        const star =
            document.createElement("div");

        star.className = "star";

        star.style.left =
            Math.random() * 100 + "%";

        star.style.top =
            Math.random() * 100 + "%";

        star.style.animationDelay =
            Math.random() * 4 + "s";

        star.style.animationDuration =
            (2 + Math.random() * 4) + "s";

        container.appendChild(star);
    }
}


/* =====================================================
   FIRE SPARKS
===================================================== */

function createSparks(count = 35) {

    const container =
        document.getElementById(
            "sparkContainer"
        );

    const lamp =
        document.getElementById(
            "lampButton"
        );

    const rect =
        lamp.getBoundingClientRect();


    for (let i = 0; i < count; i++) {

        const spark =
            document.createElement("div");

        spark.className = "spark";

        const startX =
            rect.left +
            rect.width * (.3 + Math.random() * .4);

        const startY =
            rect.top +
            rect.height * (.18 + Math.random() * .25);

        spark.style.left =
            startX + "px";

        spark.style.top =
            startY + "px";


        const x =
            (Math.random() - .5) * 220;

        const y =
            -30 -
            Math.random() * 220;


        spark.style.setProperty(
            "--x",
            `${x}px`
        );

        spark.style.setProperty(
            "--y",
            `${y}px`
        );

        spark.style.animationDelay =
            Math.random() * .4 + "s";

        container.appendChild(spark);


        setTimeout(
            () => spark.remove(),
            1800
        );
    }
}


/* =====================================================
   AUTH
===================================================== */

const landingPage =
    document.getElementById(
        "landingPage"
    );

const authScreen =
    document.getElementById(
        "authScreen"
    );

const dashboard =
    document.getElementById(
        "dashboard"
    );


function openAuth() {

    createSparks(60);

    setTimeout(() => {

        authScreen.classList.remove(
            "hidden"
        );

    }, 250);
}


function closeAuth() {

    authScreen.classList.add(
        "hidden"
    );
}


document
    .getElementById("lampButton")
    .addEventListener(
        "click",
        openAuth
    );


document
    .getElementById("closeAuth")
    .addEventListener(
        "click",
        closeAuth
    );


/* login/register switching */

document
    .getElementById("showRegister")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("loginForm")
                .classList.add("hidden");

            document
                .getElementById("registerForm")
                .classList.remove("hidden");

            clearAuthMessages();
        }
    );


document
    .getElementById("showLogin")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("registerForm")
                .classList.add("hidden");

            document
                .getElementById("loginForm")
                .classList.remove("hidden");

            clearAuthMessages();
        }
    );


function clearAuthMessages() {

    document.getElementById(
        "loginMessage"
    ).textContent = "";

    document.getElementById(
        "registerMessage"
    ).textContent = "";
}


/* =====================================================
   PASSWORD HASH
===================================================== */

async function hashPassword(password) {

    const data =
        new TextEncoder().encode(
            password
        );

    const hash =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );

    return Array
        .from(new Uint8Array(hash))
        .map(
            b => b
                .toString(16)
                .padStart(2, "0")
        )
        .join("");
}


/* =====================================================
   CREATE ACCOUNT
===================================================== */

document
    .getElementById("registerBtn")
    .addEventListener(
        "click",
        async () => {

            const name =
                document
                    .getElementById(
                        "registerName"
                    )
                    .value
                    .trim();

            const username =
                document
                    .getElementById(
                        "registerUsername"
                    )
                    .value
                    .trim()
                    .toLowerCase();

            const password =
                document
                    .getElementById(
                        "registerPassword"
                    )
                    .value;

            const confirm =
                document
                    .getElementById(
                        "registerConfirm"
                    )
                    .value;

            const message =
                document
                    .getElementById(
                        "registerMessage"
                    );


            if (
                name.length < 2 ||
                username.length < 3
            ) {

                message.style.color =
                    "#ff6464";

                message.textContent =
                    "Enter a valid name and username.";

                return;
            }


            if (password.length < 6) {

                message.style.color =
                    "#ff6464";

                message.textContent =
                    "Password must be at least 6 characters.";

                return;
            }


            if (password !== confirm) {

                message.style.color =
                    "#ff6464";

                message.textContent =
                    "Passwords do not match.";

                return;
            }


            const db =
                getDatabase();


            if (
                db.accounts[username]
            ) {

                message.style.color =
                    "#ff6464";

                message.textContent =
                    "Username already exists. Choose another.";

                return;
            }


            const passwordHash =
                await hashPassword(
                    password
                );


            db.accounts[username] = {

                name,

                passwordHash,

                createdAt:
                    new Date().toISOString()

            };


            db.users[username] = {

                days: {}

            };


            saveDatabase(db);


            currentUser =
                username;


            localStorage.setItem(
                SESSION_KEY,
                username
            );


            message.style.color =
                "#65e68b";

            message.textContent =
                "Account created! Entering Lamp Life...";


            setTimeout(
                () => {

                    enterDashboard();

                },
                700
            );

        }
    );


/* =====================================================
   LOGIN
===================================================== */

document
    .getElementById("loginBtn")
    .addEventListener(
        "click",
        async () => {

            const username =
                document
                    .getElementById(
                        "loginUsername"
                    )
                    .value
                    .trim()
                    .toLowerCase();

            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;

            const message =
                document
                    .getElementById(
                        "loginMessage"
                    );


            const db =
                getDatabase();


            const account =
                db.accounts[username];


            if (!account) {

                message.style.color =
                    "#ff6464";

                message.textContent =
                    "Account not found. Create an account first.";

                return;
            }


            const passwordHash =
                await hashPassword(
                    password
                );


            if (
                passwordHash !==
                account.passwordHash
            ) {

                message.style.color =
                    "#ff6464";

                message.textContent =
                    "Incorrect password.";

                return;
            }


            currentUser =
                username;


            localStorage.setItem(
                SESSION_KEY,
                username
            );


            enterDashboard();

        }
    );


/* enter key */

[
    "loginUsername",
    "loginPassword",
    "registerName",
    "registerUsername",
    "registerPassword",
    "registerConfirm"
].forEach(id => {

    document
        .getElementById(id)
        .addEventListener(
            "keydown",
            e => {

                if (
                    e.key === "Enter"
                ) {

                    if (
                        !document
                            .getElementById(
                                "loginForm"
                            )
                            .classList
                            .contains(
                                "hidden"
                            )
                    ) {

                        document
                            .getElementById(
                                "loginBtn"
                            )
                            .click();

                    } else {

                        document
                            .getElementById(
                                "registerBtn"
                            )
                            .click();

                    }

                }

            }
        );

});


/* show/hide passwords */

document
    .querySelectorAll(
        ".show-password"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const target =
                    document.getElementById(
                        button.dataset.target
                    );

                if (
                    target.type ===
                    "password"
                ) {

                    target.type =
                        "text";

                    button.textContent =
                        "🙈";

                } else {

                    target.type =
                        "password";

                    button.textContent =
                        "👁";

                }

            }
        );

    });


/* =====================================================
   ENTER DASHBOARD
===================================================== */

function enterDashboard() {

    landingPage.classList.add(
        "hidden"
    );

    authScreen.classList.add(
        "hidden"
    );

    dashboard.classList.remove(
        "hidden"
    );


    const db =
        getDatabase();

    const account =
        db.accounts[currentUser];


    document.getElementById(
        "welcomeText"
    ).textContent =
        `Welcome, ${account.name}`;


    selectedDate =
        new Date();


    renderAll();
}


/* =====================================================
   LOGOUT
===================================================== */

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                SESSION_KEY
            );

            currentUser = null;

            dashboard.classList.add(
                "hidden"
            );

            landingPage.classList.remove(
                "hidden"
            );

            document
                .getElementById(
                    "loginUsername"
                )
                .value = "";

            document
                .getElementById(
                    "loginPassword"
                )
                .value = "";

        }
    );


/* =====================================================
   WEEK STRIP
===================================================== */

function renderWeekStrip() {

    const container =
        document.getElementById(
            "weekStrip"
        );

    container.innerHTML = "";


    const monday =
        mondayOfWeek(
            selectedDate
        );


    const sunday =
        addDays(
            monday,
            6
        );


    document.getElementById(
        "weekRange"
    ).textContent =
        `${monthNames[monday.getMonth()]} ${monday.getDate()} – ${monthNames[sunday.getMonth()]} ${sunday.getDate()}`;


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            addDays(
                monday,
                i
            );

        const key =
            dateKey(date);

        const progress =
            getProgress(date);


        const button =
            document.createElement(
                "button"
            );

        button.className =
            "day-button";


        if (
            key ===
            dateKey(selectedDate)
        ) {

            button.classList.add(
                "selected"
            );
        }


        if (
            key ===
            dateKey(new Date())
        ) {

            button.classList.add(
                "today"
            );
        }


        button.innerHTML = `

            <div class="day-name">
                ${shortDays[date.getDay()]}
            </div>

            <div class="day-number">
                ${date.getDate()}
            </div>

            <div class="day-month">
                ${monthNames[date.getMonth()].slice(0,3)}
            </div>

            <div class="day-progress">
                <div
                    class="day-progress-fill"
                    style="width:${progress.percent}%">
                </div>
            </div>

        `;


        button.addEventListener(
            "click",
            () => {

                selectedDate =
                    date;

                showView("day");

                renderAll();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


        container.appendChild(
            button
        );
    }
}


/* =====================================================
   DAY VIEW
===================================================== */

function renderDay() {

    const key =
        dateKey(selectedDate);

    const weekday =
        dayNames[
            selectedDate.getDay()
        ];


    const progress =
        getProgress(
            selectedDate
        );


    document.getElementById(
        "selectedDayLabel"
    ).textContent =
        weekday;


    document.getElementById(
        "selectedDateText"
    ).textContent =
        formatDate(
            selectedDate
        );


    document.getElementById(
        "selectedDayDescription"
    ).textContent =
        selectedDate.toDateString() ===
        new Date().toDateString()
            ? "Today's missions."
            : "Your saved missions and progress for this day.";


    document.getElementById(
        "progressNumber"
    ).textContent =
        `${progress.percent}%`;


    document.getElementById(
        "progressBar"
    ).style.width =
        `${progress.percent}%`;


    document.getElementById(
        "completedCount"
    ).textContent =
        `${progress.done} completed`;


    document.getElementById(
        "totalCount"
    ).textContent =
        `${progress.total} missions`;


    const dayData =
        getDayData(key);


    document.getElementById(
        "reflectionText"
    ).value =
        dayData.reflection || "";


    renderTasks();

    renderPhoto();
}


/* =====================================================
   TASK LIST
===================================================== */

function renderTasks() {

    const list =
        document.getElementById(
            "taskList"
        );

    list.innerHTML = "";


    const tasks =
        getTasksForDate(
            selectedDate
        );


    if (
        tasks.length === 0
    ) {

        list.innerHTML = `

            <div style="
                padding:40px;
                text-align:center;
                color:#777;
            ">
                No missions scheduled.
            </div>

        `;

        return;
    }


    tasks.forEach(task => {

        const row =
            document.createElement(
                "div"
            );


        row.className =
            "task";


        if (
            task.state === "done"
        ) {

            row.classList.add(
                "done"
            );
        }


        if (
            task.state === "wrong"
        ) {

            row.classList.add(
                "not-done"
            );
        }


        row.innerHTML = `

            <div class="task-time">
                ${escapeHTML(task.time)}
            </div>

            <div class="task-content">

                <h3>
                    ${categoryIcon(task.category)}
                    ${escapeHTML(task.title)}
                </h3>

                <p>
                    ${escapeHTML(task.description || "")}
                </p>

            </div>

            <div class="task-actions">

                <button
                    class="task-btn done-btn ${
                        task.state === "done"
                            ? "active-done"
                            : ""
                    }"
                    title="Done"
                    data-action="done">
                    ✓
                </button>

                <button
                    class="task-btn wrong-btn ${
                        task.state === "wrong"
                            ? "active-wrong"
                            : ""
                    }"
                    title="Not Done"
                    data-action="wrong">
                    ✕
                </button>

                <button
                    class="task-btn reset-btn"
                    title="Reset"
                    data-action="reset">
                    ↺
                </button>

            </div>

        `;


        row
            .querySelectorAll(
                ".task-btn"
            )
            .forEach(btn => {

                btn.addEventListener(
                    "click",
                    () => {

                        updateTaskState(
                            task.id,
                            btn.dataset.action
                        );

                    }
                );

            });


        list.appendChild(row);

    });

}


/* =====================================================
   TASK STATE
===================================================== */

function updateTaskState(
    taskId,
    action
) {

    const key =
        dateKey(selectedDate);

    const dayData =
        getDayData(key);


    if (
        action === "done"
    ) {

        dayData.states[taskId] =
            "done";

    } else if (
        action === "wrong"
    ) {

        dayData.states[taskId] =
            "wrong";

    } else {

        delete dayData.states[
            taskId
        ];

    }


    saveDayData(
        key,
        dayData
    );


    renderAll();
}


/* =====================================================
   ADD CUSTOM TASK
===================================================== */

document
    .getElementById(
        "addTaskBtn"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "addTaskPanel"
                )
                .classList
                .remove("hidden");

            document
                .getElementById(
                    "customTaskTitle"
                )
                .focus();

        }
    );


document
    .getElementById(
        "cancelCustomTask"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "addTaskPanel"
                )
                .classList
                .add("hidden");

        }
    );


document
    .getElementById(
        "saveCustomTask"
    )
    .addEventListener(
        "click",
        () => {

            const title =
                document
                    .getElementById(
                        "customTaskTitle"
                    )
                    .value
                    .trim();

            const time =
                document
                    .getElementById(
                        "customTaskTime"
                    )
                    .value
                    .trim();

            const category =
                document
                    .getElementById(
                        "customTaskCategory"
                    )
                    .value;


            if (!title) {

                alert(
                    "Enter a task name."
                );

                return;
            }


            const key =
                dateKey(selectedDate);

            const dayData =
                getDayData(key);


            if (!dayData.customTasks) {

                dayData.customTasks =
                    [];
            }


            dayData.customTasks.push({

                id:
                    `custom-${Date.now()}`,

                title,

                time:
                    time || "Flexible",

                description:
                    `Custom ${category} mission.`,

                category

            });


            saveDayData(
                key,
                dayData
            );


            document.getElementById(
                "customTaskTitle"
            ).value = "";

            document.getElementById(
                "customTaskTime"
            ).value = "";


            document
                .getElementById(
                    "addTaskPanel"
                )
                .classList
                .add("hidden");


            renderAll();

        }
    );


/* =====================================================
   REFLECTION
===================================================== */

document
    .getElementById(
        "saveReflection"
    )
    .addEventListener(
        "click",
        () => {

            const key =
                dateKey(selectedDate);

            const dayData =
                getDayData(key);


            dayData.reflection =
                document
                    .getElementById(
                        "reflectionText"
                    )
                    .value;


            saveDayData(
                key,
                dayData
            );


            const button =
                document
                    .getElementById(
                        "saveReflection"
                    );


            button.textContent =
                "✓ SAVED";


            setTimeout(
                () => {

                    button.textContent =
                        "SAVE REFLECTION";

                },
                1200
            );

        }
    );


/* =====================================================
   PHOTO
===================================================== */

document
    .getElementById(
        "photoBtn"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "photoInput"
                )
                .click();

        }
    );


document
    .getElementById(
        "photoInput"
    )
    .addEventListener(
        "change",
        e => {

            const file =
                e.target.files[0];

            if (!file) return;


            const reader =
                new FileReader();


            reader.onload =
                event => {

                    const key =
                        dateKey(
                            selectedDate
                        );

                    const dayData =
                        getDayData(key);


                    dayData.photo =
                        event.target.result;


                    saveDayData(
                        key,
                        dayData
                    );


                    renderPhoto();

                };


            reader.readAsDataURL(
                file
            );

        }
    );


function renderPhoto() {

    const container =
        document.getElementById(
            "photoPreview"
        );

    const dayData =
        getDayData(
            dateKey(selectedDate)
        );


    if (!dayData.photo) {

        container.innerHTML = "";

        return;
    }


    container.innerHTML = `

        <img
            src="${dayData.photo}"
            alt="Saved memory">

    `;
}


/* =====================================================
   WEEK VIEW
===================================================== */

function renderWeekOverview() {

    const container =
        document.getElementById(
            "weekOverview"
        );

    container.innerHTML = "";


    const monday =
        mondayOfWeek(
            selectedDate
        );


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            addDays(
                monday,
                i
            );


        const progress =
            getProgress(date);


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "week-overview-card";


        card.innerHTML = `

            <div class="week-overview-head">

                <div class="week-overview-date">

                    <div class="week-big-number">
                        ${date.getDate()}
                    </div>

                    <div>

                        <div class="week-overview-title">
                            ${dayNames[date.getDay()]}
                        </div>

                        <div class="week-overview-sub">
                            ${monthNames[date.getMonth()]}
                            ${date.getDate()}
                            •
                            ${progress.done}/${progress.total}
                            completed
                        </div>

                    </div>

                </div>

                <div class="week-percent">
                    ${progress.percent}%
                </div>

            </div>

            <div class="week-mini-bar">

                <div
                    class="week-mini-fill"
                    style="width:${progress.percent}%">
                </div>

            </div>

        `;


        card.addEventListener(
            "click",
            () => {

                selectedDate =
                    date;

                showView("day");

                renderAll();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


        container.appendChild(
            card
        );
    }
}


/* =====================================================
   MONTH VIEW
===================================================== */

function renderMonth() {

    const container =
        document.getElementById(
            "monthCalendar"
        );

    container.innerHTML = "";


    const year =
        selectedDate.getFullYear();

    const month =
        selectedDate.getMonth();


    document.getElementById(
        "monthTitle"
    ).textContent =
        `${monthNames[month]} ${year}`;


    const headings = [
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT",
        "SUN"
    ];


    headings.forEach(day => {

        const el =
            document.createElement(
                "div"
            );

        el.className =
            "month-day-name";

        el.textContent =
            day;

        container.appendChild(
            el
        );

    });


    const first =
        new Date(
            year,
            month,
            1
        );


    let start =
        first.getDay();

    start =
        start === 0
            ? 6
            : start - 1;


    for (
        let i = 0;
        i < start;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "month-cell empty";

        container.appendChild(
            empty
        );

    }


    const days =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    for (
        let day = 1;
        day <= days;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );


        const progress =
            getProgress(date);


        const cell =
            document.createElement(
                "div"
            );


        cell.className =
            "month-cell";


        if (
            dateKey(date) ===
            dateKey(new Date())
        ) {

            cell.classList.add(
                "today"
            );
        }


        cell.innerHTML = `

            <div class="month-number">
                ${day}
            </div>

            <div class="month-percent">
                ${progress.percent}%
            </div>

        `;


        cell.addEventListener(
            "click",
            () => {

                selectedDate =
                    date;

                showView("day");

                renderAll();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


        container.appendChild(
            cell
        );

    }
}


/* =====================================================
   VIEW SWITCHING
===================================================== */

function showView(view) {

    const day =
        document.getElementById(
            "dayView"
        );

    const week =
        document.getElementById(
            "weekView"
        );

    const month =
        document.getElementById(
            "monthView"
        );


    day.classList.add("hidden");
    week.classList.add("hidden");
    month.classList.add("hidden");


    document
        .querySelectorAll(
            ".view-tab"
        )
        .forEach(btn => {

            btn.classList.remove(
                "active"
            );

        });


    if (view === "day") {

        day.classList.remove(
            "hidden"
        );

        document
            .querySelector(
                '[data-view="day"]'
            )
            .classList.add(
                "active"
            );

    }


    if (view === "week") {

        week.classList.remove(
            "hidden"
        );

        document
            .querySelector(
                '[data-view="week"]'
            )
            .classList.add(
                "active"
            );

    }


    if (view === "month") {

        month.classList.remove(
            "hidden"
        );

        document
            .querySelector(
                '[data-view="month"]'
            )
            .classList.add(
                "active"
            );

    }

}


document
    .querySelectorAll(
        ".view-tab"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                showView(
                    button.dataset.view
                );

                renderAll();

            }
        );

    });


/* =====================================================
   RENDER EVERYTHING
===================================================== */

function renderAll() {

    if (!currentUser) return;

    renderLiveDate();

    renderWeekStrip();

    renderDay();

    renderWeekOverview();

    renderMonth();

}


/* =====================================================
   LIVE DATE
===================================================== */

function renderLiveDate() {

    const now =
        new Date();

    document.getElementById(
        "liveDate"
    ).textContent =
        now.toLocaleDateString(
            "en-IN",
            {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
}


/* =====================================================
   ICONS
===================================================== */

function categoryIcon(category) {

    const icons = {

        "Fitness": "🏃",

        "College": "📚",

        "CAT": "🎯",

        "AI / Skill": "🤖",

        "Finance Learning": "📈",

        "Personal": "🧘",

        "Other": "✨"

    };

    return icons[category] || "✨";
}


/* =====================================================
   SECURITY / HTML ESCAPE
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =====================================================
   SESSION RESTORE
===================================================== */

function restoreSession() {

    const saved =
        localStorage.getItem(
            SESSION_KEY
        );


    if (!saved) {

        createStars();

        return;
    }


    const db =
        getDatabase();


    if (
        !db.accounts[saved]
    ) {

        localStorage.removeItem(
            SESSION_KEY
        );

        createStars();

        return;
    }


    currentUser =
        saved;


    enterDashboard();
}


/* =====================================================
   START
===================================================== */

createStars();

restoreSession();