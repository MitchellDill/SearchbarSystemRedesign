# Searchbar System Redesign

The goal of this application was to take an existing codebase, written to accomodate a database of 100 items, and scale that program to handle 10 million items. This involved refactoring the front end, as the legacy codebase was performing a client-side fuzzy search on its entire stock, and testing back end replacement databases of both PostgreSQL and Elasticsearch using Artillery.

### Challenges Faced:

#### Cutting down DB seed time without using a CSV
I established a workable method for seeding, but it would take a really long time as-is. I tried several different approaches (and considered opting for a CSV insert, which my research would suggest is the optimal strategy for generating an enormous table), but stayed my course for a couple reasons.
I wanted to write an IIFE that will eventually be able to auto-seed a deployed, containerized DB using docker compose.
It felt like a conquerable problem and I’m a bit stubborn.

I eventually got it down to about 9 minutes for seeding 10mil unique rows of a locally deployed docker container with no copying. I was initially trying to insert a single row at a time, and for one reason or another PG wasn’t properly awaiting my insert loops, resulting in a function that worked totally fine for an insert of 1000 items, but dropped sharply down to about 67% success rate once the number was up around 5000. Well shy of ten million! 

So, I knew something needed to change. With Zona and Justan’s guidance, I opted for a bulk insert of 1000 items at once inside a single, actual query. I didn’t actually know that would work. It works! So, success. My initial seed took about 22 minutes with my eventual successful method of looping over that 1000 item query-builder, but I then learned by second lesson of the day, which is nodemon + an IIFE + the statement “IF TABLE EXISTS THEN DROP” at the top of that IIFE = a smaller table than you had about 30 seconds ago. It gave me an opportunity to streamline, however, and I changed my pool to accept up to 75 maximum connections. Went a bit faster, that did.

Still need to learn the CSV method to be real. And there were a couple of other cool methods/suggestions for big bulk inserts. But I’m glad to have succeeded here.

The final lesson was learned when I fired up Artillery for the first time. That lesson was “your legacy frontend that requests literally every item from the database might not have expected its database would one day contain ten million items.”

*note: I later used the info learned here to seed my elasticsearch index in an expedient manner as well*

