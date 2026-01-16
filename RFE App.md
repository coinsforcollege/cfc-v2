We are brainstorming today so no need to edit codes or create any implementation plans. This current project is for Coins For College \- CFC. The app basically allows people to come and mine tokens for their favorite colleges. Admins can list colleges, so can other people from colleges. College admins can also claim existing college pages.  
Now I want to build a totally distinct frontend- for mobile. This frontend wont just be a mobile version of CFC. In fact it will be called RFE \- Rewards For Education. RFE will be for children/school students only. They will come to the app and complete tasks to earn Scholarship Points (SP \- our point system). This will allow us to build a student pool who will eventually want to go to a college. They can search for colleges, and follow them, check them out. The colleges can search for students, send them scholarship offers for admissions. So we become a marketplace like amazon connecting students with colleges.

Every college has a coin (who is on our platform), so they offer a scholarship like if you have 100k SP then based on your profile, academic history, etc a 4500 St Edwards Coin. These coins are “pledged”. Students can accept or reject these offers. Basically it will just save it to their profiles. When it comes time to enroll \- based on current market price or as per college discretion (happens offline) the 4500 St Edwards Coin can be converted into a $100 discount or a $100000 discount. So it will just bring their tuition fee down a bit. When it happens the college’s token balance will be deducted. So balance only changes when an enrollment happens. We dont monetize anywhere just yet. The idea is that colleges offer scholarships which are hidden discounts anyway, we are just offering them a way to market themselves. Think of platforms like policybazar where insurance providers offer same policies at a discount because they just want more customers. 

Then students can also mine tokens using our existing system which gives them “extra” coins which are theirs to keep from today. Of course it is up to colleges to decide if they want to allow mining. So I see sections like Tasks, Colleges, Scholarships (where public scholarships from colleges are shown for everyone. Offers section where offers received from colleges and sent to colleges are shown along with history of acceptances and rejections. Profile section which will lead to account settings, Document folder, Application form, Visa, Language etc.

1. How are tasks created for students  
   1. Relevant to them  
   2. How to evaluate  
   3. Who evaluates  
   4. Automations  
   5. AI generated tasks  
   6. Grade based  
   7. Academic, social, health, psycholigical etc  
2. Folder for documents transcripts etc  
   1. Transcripts  
   2. Cover letters  
   3. Recommendation letters  
   4. Essays  
   5. ID documents  
   6. A very detailed application that can apply to any college in general  
3. Easy one click apply using these documents (like on linkedin or job portals where all info is presaved and you just click a button to apply)  
4. Student profile \- where want to study  
5. Language preparation guidelines for students based on desired location and college \- not real teaching but managing the milestones, basically informative  
6. Visa and other preparation journey based on desired location and college \- mostly informative broken into steps

# Tasks

Using OpenAI api  
---

## **1\. Core idea: Auto engine feeds a content bank, tasks only read from the bank**

Inside RFE there are three pieces:

1. **Content Bank**  
   * Stores questions, quizzes, and task definitions.  
   * Every item knows: subject, topic, grade, difficulty, type (quiz, info, etc.).  
   * Auto engine writes here. Tasks read from here.  
2. **Auto Engine (backend only)**  
   * Takes instructions like “Give me 50 Grade 9 math questions for linear equations”.  
   * Generates them using patterns \+ AI.  
   * Self-checks them.  
   * Saves them into the Content Bank.  
   * Marks them as “auto-generated”.  
3. **Task Templates / Scheduler**  
   * Daily/weekly templates that say:  
     * “For Grade 9, daily math quiz \= 10 questions from Bank where subject=Math, difficulty=Easy/Medium.”  
   * Scheduler ensures there is always a task instance on the student side.  
   * When student starts a task, it just **pulls items from the bank**, not the engine directly.

So **auto \= engine → bank**,  
and **student \= tasks → bank → SP**,  
never engine → student.

---

## **2\. How the bank stays full without humans**

Two auto mechanisms:

### **A) Background refill**

On a schedule (for example, nightly):

1. System checks per segment (grade \+ subject \+ topic):  
   * “How many unused items left in the bank?”  
2. If a segment is low (e.g., \< N questions left):  
   * It calls the Auto Engine with a spec:  
     * Grade, subject, topic, difficulty  
     * Quantity to generate  
3. Engine generates, self-checks, and writes more items to the bank.

End result: even if no one ever logs into an admin panel, the bank keeps refilling itself wherever it’s running low.

### **B) Admin “Generate” button**

In an internal RFE admin screen:

* Select grade, subject, topic, difficulty.  
* Click **Generate content**.  
* Engine creates a batch and drops it into the bank.

This is optional. You only use it when you want to steer content; the system doesn’t depend on humans for supply.

---

## **3\. How the student always has something to do**

From the student’s side, the app only talks to:

* **Templates** (what type of task)  
* **Content Bank** (what content goes inside)

### **Daily loop example**

For a Grade 9 student, the scheduler ensures every day there are tasks like:

1. **Daily math practice**  
   * Template: “10 questions from Bank: grade=9, subject=Math, difficulty=Easy/Medium”.  
   * When student presses Start:  
     * App pulls 10 items from the bank for that template.  
     * Questions are already stored, with correct answers.  
     * App auto-grades and gives SP.  
2. **Daily English/Reasoning/etc.**  
   * Same pattern: template → pull from Bank → auto-grade → SP.

If the bank is ever close to empty for that segment, the **background refill** kicks in **before** students run out, so:

* There is **always** enough content for daily/weekly tasks.  
* Students never hit “no tasks available” just because no human wrote questions.

---

## **4\. What “auto” now means (your constraint respected)**

When we say **auto** in RFE now, it is exactly this:

* System **creates content into the bank** using the Auto Engine.  
* System **keeps the bank full** automatically.  
* Student tasks **only use bank content**, which already has correct answers.  
* SP is always given through:  
  * a task template  
  * using items from the bank  
  * with fully automatic grading.

At no point in this “auto” story do we depend on “some human will sit and write content”.

That’s an option, not the baseline.

**Request:** “Give me 500 items for Grade 9 / Social Science / Climate & Weather / MCQ / Medium difficulty.”

Here is exactly how the automatic content generator handles that, step by step, with **no humans writing anything**.

---

## **1\. Receive a Social Science request**

The generator gets:

* subject: `social_science`  
* topic: `climate_and_weather`  
* grade: `9`  
* difficulty: `medium`  
* type: `mcq`  
* count: `500`

It now has one job: **produce 500 valid MCQs that fit this spec and store them in the Content Bank.**

---

## **2\. Draft one candidate Social Science question**

For each item it needs (up to 500), it does a loop:

### **2.1 Ask the AI submodule to draft a question**

It calls its AI submodule with a very strict schema:

* Inputs:  
  * subject: Social Science  
  * topic: Climate & Weather  
  * grade: 9  
  * difficulty: medium  
  * format: MCQ (4 options, 1 correct, 1–2 line explanation)  
* Output must be a JSON-like structure (conceptually):  
  * `question_text`  
  * `options` (array of 4 distinct strings)  
  * `correct_option_index` (0–3)  
  * `explanation_text`

If the AI responds with anything that does not fit that structure (wrong number of options, missing fields, etc.), the generator **throws it away immediately** and asks again.

So all candidate items have the same shape before moving on.

---

## **3\. Validate the Social Science question**

For each candidate, the generator then runs multiple checks.

### **3.1 Schema / format check**

* `question_text` is non-empty, short enough, plain text.  
* `options` has exactly 4 elements.  
* All options are non-empty and not identical.  
* `correct_option_index` is an integer in 0–3.

If any of this fails → discard and re-generate another candidate.

### **3.2 Knowledge consistency check (Social Science specific)**

The generator now checks that the AI’s own answer is self-consistent.

* It sends the **same question and options** back to the AI submodule in “answer mode” and asks:  
  “Which option is correct for a Grade 9 Social Science student?”  
* If the AI chooses the same `correct_option_index` as the original draft:  
  * Pass this check.  
* If it picks a **different** option:  
  * Treat the item as unreliable → discard, re-generate.

This ensures the correct answer is not random; the same model, asked as a student, agrees with itself about which option is correct.

### **3.3 Grade / difficulty check**

The generator asks the AI submodule to classify the candidate:

* “Is this question appropriate for Grade 9?”  
* “Is it easy / medium / hard?”

If the answer is **Grade 9 appropriate** and **medium difficulty**, accept.  
If it’s too easy, too hard, or feels like a different grade level → discard and re-generate.

### **3.4 Topic check (Social Science topicality)**

The generator asks:

* “What Social Science topic does this question belong to?”  
* AI responds with a label (e.g. Climate & Weather, Population, Resources, etc.) from the known topic set.

If the topic label includes or matches `Climate & Weather`, accept.  
If it belongs to a different topic (e.g. Indian Constitution, Agriculture, etc.) → discard and re-generate.

### **3.5 Safety / appropriateness check**

The generator instructs the AI submodule to classify:

* Is the question appropriate for under-18 students?  
* Does it include banned content (self-harm, hate speech, adult content, etc.)?

If the answer is **safe\_for\_under\_18** and no banned category flags → accept.  
If any unsafe category appears → discard and re-generate.

### **3.6 De-duplication vs existing bank**

Finally, before saving:

* The generator compares the candidate’s `question_text` (and maybe options) to existing **Grade 9 / Social Science / Climate & Weather** items already in the Content Bank.  
* If similarity is above a threshold (almost the same wording) → discard and re-generate.  
* If it’s sufficiently different → proceed.

---

## **4\. Save Social Science item to the Content Bank**

If the candidate passes all checks:

The generator writes it into the Content Bank with metadata:

* subject: `social_science`  
* topic: `climate_and_weather`  
* grade: `9`  
* difficulty: `medium`  
* type: `mcq`  
* question\_text, options, correct\_option\_index, explanation\_text  
* source: `auto`  
* usage counters: `times_served = 0`, `last_served_at = null`

Then it moves on to draft the next item, until it has **500 stored Social Science items** in that bucket.

---

## **5\. How tasks use these Social Science items**

Later, when a Grade 9 student launches an **auto Social Science task**, e.g.:

“Social Science – Climate & Weather quiz (5 questions)”

The task template says:

* subject: Social Science  
* topic: Climate & Weather  
* grade: 9  
* difficulty: medium  
* count: 5

At that moment the app:

1. Queries the Content Bank: “Give me 5 items matching this spec with lowest `times_served`, that this student hasn’t seen recently.”  
2. Gets 5 stored items (already validated with correct answers).  
3. Shows them to the student.  
4. When student submits answers:  
   * Compares against the stored `correct_option_index`.  
   * If pass condition is met → mark task Completed, award SP.

The generator is **not involved** in this step; it did all its work earlier when filling the bank.

---

So, for Social Science:

* The generator **only uses AI** to propose MCQs and explanations.  
* It **auto-checks** each item for structure, correctness, grade level, topic match, safety, and duplication.  
* It **stores** items that pass.  
* Tasks **pull** from this stored pool and auto-grade using the stored correct answers.

---

## **1\. Content Library – what exists before any task**

This is just storage for **reusable content blocks**:

* Quiz questions (with options \+ correct answer)  
* Short info text \+ 2–3 quiz questions  
* Reflection prompts (“What went well this week?”)

Each block is tagged:

* Subject (Math, English, Social Science, etc.)  
* Topic (Linear equations, Climate & Weather, etc.)  
* Grade  
* Difficulty  
* Language  
* Type (quiz question / info+quiz / reflection prompt / etc.)

### **How Library gets filled**

Two ways:

1. **Admin written**  
   * RFE admin or college admin types a question manually:  
     * Question, options, correct answer, tags  
   * Saved into Library.  
2. **AI generated (auto)**  
   * Admin says: “Create content for: Grade 9, Social Science, Climate & Weather.”  
   * RFE calls AI to propose questions.  
   * RFE only saves questions that:  
     * have the right structure (question, 4 options, one correct)  
     * are self-consistent (AI agrees with its own correct option)  
     * fit the topic \+ grade  
     * pass safety checks  
     * are not near-duplicates of what’s already stored

Result: Library always has some content, even if humans don’t type any questions.

---

## **2\. Task Templates – who defines tasks and what they are**

A **Task Template** is a rule that RFE or a college creates.

It says:

* **Owner**  
  * RFE or a specific college  
* **Category**  
  * Academic  
  * Profile / Documents  
  * Language / Skills  
  * College / Career exploration  
  * Social / Community / Health-light  
* **Target students**  
  * Grade range  
  * Country  
  * Desired study destination  
  * Interests (STEM, Arts, etc.)  
  * Follows this college or not  
* **Reward**  
  * SP amount for completion  
* **Completion mode**  
  * **Auto**  
    * App can decide “done / not done” and give SP itself  
  * **Manual**  
    * Human must approve/reject the attempt  
* **Input type**  
  * If **Auto**:  
    * Quiz (using questions from Library **or** questions typed by admin)  
    * Info \+ short quiz (from Library)  
    * Reflection form (prompt from Library, completion \= form filled)  
    * In-app action (follow N colleges, save scholarships, etc.)  
  * If **Manual**:  
    * File upload  
    * Photo / video captured in app  
    * Long text (essay, statement)  
* **Timing**  
  * Once  
  * Daily  
  * Weekly  
  * Between start date and end date

Important:

* **Admins CAN create auto tasks manually**: they select “Auto” and type questions with correct answers.  
* **Admins CAN also point to Library**: auto tasks that pull content the AI created earlier.

“Auto” \= **how completion is decided**, not **who wrote content**.

---

## **3\. Task Instances – what the student actually sees**

For each student and each day/week, RFE looks at all Task Templates and creates **Task Instances** for this student.

Each Task Instance has:

* Which template it belongs to  
* The student it belongs to  
* A time window (today / this week / campaign dates)  
* Status:  
  * **Available**  
  * **In progress**  
  * **Submitted** (only for manual)  
  * **Completed**  
  * **Rejected**  
  * **Expired**

The **Tasks screen** in the app is just a list of these Instances for that student.

---

## **4\. What happens when a student uses an auto task**

Example auto templates:

* “Grade 9 Math – 10-question quiz – 100 SP”  
* “Social Science – Climate & Weather – 5 questions – 80 SP”  
* “Plan your week – 3 reflection questions – 50 SP”  
* “Follow 3 colleges – 60 SP”

### **Flow**

1. **Start**  
   * The Instance is **Available**.  
   * Student taps it → status becomes **In progress**.  
2. **Get content (if needed)**  
   * If quiz / info+quiz / reflection:  
     * RFE picks items from the Library that match:  
       * subject, topic, grade, difficulty, type  
       * (or uses the fixed questions the admin typed)  
   * If in-app action:  
     * Template says: “Student must follow 3 colleges”, etc.  
3. **Student does the work**  
   * Quiz: answers questions.  
   * Info+quiz: reads, answers MCQs.  
   * Reflection: writes answers.  
   * In-app action: follows colleges, saves scholarships, etc.  
4. **Completion check (this is what makes it auto)**  
   * For **quiz / info+quiz**:  
     * RFE compares student’s answers with the stored correct answers.  
     * If they meet pass mark:  
       * Instance → **Completed**, SP added.  
     * If they fail:  
       * Instance stays **In progress** or becomes “failed but retry allowed” depending on your rule.  
   * For **reflection**:  
     * If required fields are filled:  
       * Instance → **Completed**, SP added.  
   * For **in-app actions**:  
     * When the required action is done (e.g. “followed 3 colleges”):  
       * Instance → **Completed**, SP added.  
5. **Time limit**  
   * If the time window ends and Instance is not Completed:  
     * Status → **Expired**, no SP from that Instance.

No human reviews these.  
AI only appeared earlier when Library content was created, not during student attempts.

---

## **5\. What happens when a student uses a manual task**

Example manual templates:

* “Upload your latest transcript – 500 SP”  
* “Upload a 1-page essay draft – 300 SP”  
* “Submit photos of your project – 200 SP”

### **Flow**

1. **Start**  
   * Instance is **Available**.  
   * Student taps it → **In progress**.  
   * App shows exactly what is needed (file, photo, text).  
2. **Submit**  
   * Student uploads / records / writes and hits **Submit**.  
   * Instance → **Submitted**.  
   * SP **not** yet added.  
3. **Review**  
   * If template owned by RFE:  
     * RFE reviewers see the submission.  
   * If owned by a college:  
     * Reviewers for that college see it.  
4. For each Submitted Instance they see:  
   * Student  
   * Task template  
   * Attached material  
   * Buttons: **Approve** / **Reject** and a place to write a note.  
   * If they click **Approve**:  
     * Instance → **Completed**  
     * SP added  
   * If they click **Reject**:  
     * Instance → **Rejected**  
     * SP not added  
     * Reason saved  
5. **Resubmissions (default shape)**  
   * From **Rejected**, student may be allowed to **try again** a limited number of times.  
   * When they resubmit:  
     * Instance → **Submitted** again with new material.  
   * After max attempts or after deadline:  
     * Instance stays **Rejected** or becomes **Expired**.

Again, AI is **optional** here. Reviewers decide Approve / Reject.

---

## **6\. Who does what (short recap)**

* **AI**  
  * Only helps fill the **Content Library** (questions, info+quiz, prompts).  
  * RFE filters what AI produces before saving.  
* **RFE admins**  
  * Create Task Templates (auto or manual).  
  * May also create Library content by hand.  
  * May press “Generate more” for AI.  
* **College admins**  
  * Create their own Task Templates (auto or manual).  
  * Review manual tasks they own.  
* **Students**  
  * Never create tasks.  
  * Only see Task Instances, do them, and get SP when rules say so.