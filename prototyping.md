**Phase** : Prototyping

**Due date** : Monday, Feb 24 at 11:59pm PT

**The goal** of this stage of the project is to rapidly iterate on system designs (ideally, in parallel)
and get regular feedback from users.

**Course learning objectives** this assignment facilitates: (1) Create an interactive system
grounded in user research, iterative prototyping, and evaluation and (2) Explore and express
complex problems, design choices.

**Grading** : This is a group assignment. All members of the group are expected to participate fully.
Each group will receive one grade. / Every member will receive the same number of points.

**What to submit** : Add a .MD file in your Github repo with the responses to the following
questions. **Submit the github repo link to BruinLearn. Only one person needs to submit for
the group.**

**[+0.5] Update your problem statement.**

Social media companies such as TikTok, Meta, and Snapchat have privacy policies for their apps
that describe how user data can be used by the company. However, these companies have made it
difficult for users to understand these policies by making them long and full of complex, legal
jargon. As a result, users often skim through or skip reading the privacy policies for these apps,
leaving themselves unaware of what companies can do with their personal data.

**[+1] Create a paper prototype. Take + upload pictures or a video of your paper prototype.**

**_Figma Prototype:_**
https://www.figma.com/design/vCiIZ9ekTLGWR5nS8ypXup/Modal-Mockup?node-id=0-1&p=f
&t=1dUMe8nmnwOBMvOW-

**[+0.5] Summarize 1-3 takeaways from the feedback you received in class.**

```
1) People were confused about what our ranking system was based on, and what it meant
2) People voiced concerns about LLMs being unreliable or hallucinating and were
wondering how our design could mitigate this issue
3) People were confused as to when/where the popup would show up, and if it will be
layered over the company’s notice or if it's a completely separate popup.
```
**[+1] Articulate your design goals as you start to implement a high-fidelity prototype of your
interactive system.**

**_Design goal 1:_**

The goal is to emphasize and use more visual methods of representing the data privacy
issues/safety. This is because our user research stated that people tend to not read the T&C/PP
due to the dense and long text, and would be more interested in learning about data privacy


issues if there was a visual representation that would be easy to grasp. To design for this goal, we
chose to do a rating system that rates the security/data privacy on a scale of 1-5 stars. We chose
to do this because it is very clear if it is an issue or not, and users can choose to learn more if
they choose to, by clicking learn more for each subtopic.

**_Design goal 2:_**

Making our information clear and concise is critical for helping users understand the information
being presented to them. In our user studies, there was extensive confusion surrounding the
content of the privacy policy and what it meant. If we cannot rephrase this content in a manner
that is more accessible to people, then our tool will not actually be of much use to people. To
achieve this goal we can implement several design strategies:

- Focus on summarization of content using accessible, non-legal terminology
    - A main pain point for people was a lack of cohesiveness - things would be
       referenced in many locations
- Clarify vague language
    - Specify what a ‘product’ means in the context of the document for instance

We can implement these by prompting the LLM to use accessible language and by being very
specific about what kind of summarization we want back from it. We will need to do more
research before we can figure out exactly what this will look like, but ideally the LLM will be
able to do this without compromising the accuracy of it’s responses.

**[+1] Provide a plan for implementation. Create a timeline. Suggestion: Work backwards
from the March 4 pilot deadline**.

As of this submission, the popup has been created and there is a (semi) functional backend that
scrapes a webpage for the privacy policy link. A request is sent to a node.js server which then
uses puppeteer to scrape the data for the privacy policy. From here, our plan is to determine
which LLM model to pass the policies to and how we can most successfully format our request/s
to it. Once we have determined this, we also need to determine what format we want to receive
the response in. Once this has been implemented, we can focus on passing this data from the
backend node.js server to the frontend. The frontend UI will be under development during this
time in parallel with the LLM implementation. Once the best graphical interface has been
designed, dummy data on the frontend will be replaced with actual data passed back from the
LLM. The frontend will be done in Javascript React.

**Feb 25/26:**

- Determine how best to pass the privacy policy to the LLM
- Develop front end structure/finalize prototypes to test
    - User input on best way to display info
- Initial frontend prototyping/development

**Feb 27/28:**

- Implement passing of data to LLM and determine best format to receive data back from
    LLM


- Integrate with basic frontend

**Mar 1/2:**

- Finalize LLM data processing implementation and focus on passing it to
    frontend/frontend implementation
- Beautify frontend

**Mar 3:**

- Finalize details. Surely there will be a lot of straggling bugs...

**What did each member contribute to this phase of the project?**

We divided up the writing for this core assignment equally. Brooke mostly focused on the web
scraping aspect of the prototype, developing the javascript code to find privacy policy links and
grab the contents of the privacy policy. Sruthi worked with the LLM API to get an analysis of
privacy policies. She tried different prompts to get results that were easy to display on the
frontend. Nikhil worked on the frontend, making components that both look good and also
display the required content for the extension.

**Did you use a generative AI tool? If so, which and how?**

No, we did not use a generative AI tool for this core assignment.

**How much time did you spend on this assignment**

**- as a group?**

Most of our group work time came after class to discuss any concerns we had with individual
work. We’ll also likely meet up to integrate the different parts of the prototype that we’re
working on. So far, about 2 hours as a group but that will grow a lot as the prototype progresses.

**- individually?**

We spent about 30-45 minutes each writing up our parts for this core assignment. Additionally,
we will spend a couple more hours each (probably around 4-5) to write code for our chrome
extension prototype.

[+1] Depth: Conduct an additional two cognitive walkthroughs with potential users (+0.5 per
session)

[+1] Depth: Conduct another 2 user research sessions (+0.5 per session)

[+1] Depth: Find a model paper with a design goals section. Write up your design goals in a
similar fashion. The model paper can be the same as before.


