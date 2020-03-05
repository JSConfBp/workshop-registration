# workshop-registration

Web app to help our attendees register for workshops.

Goals why we created this:
- offer free workshops, for every ticket holder
- attendees can sign up for workshops using their Ticket Booking Reference (like AAAA-1)
- this way no Personal Information is used, GDPR compliant
- they should be able to pick only one, so nobody reserves seat on 2 workshops
- register for workshops which have open seats
- workshops are opened up gradually, attendees should see upcoming workshops
- attendees should be able to de-register themselves from every workshop if necessary
- before the workshops we export the data, Booking References and related Workshops, and create attendee lists manually

## Setup

Express / NextJS / React / Material UI

- Deployed to Heroku, needs a Redis instance
- Ticket Booking References are checked in the tito API, you'll need the API URL and an API Token

## Development

- Clone repo
- Copy `.env.example` as `.env` and fill out the fields
- Run `npm install`
- Start dev server with `npm run dev`

This will spin up a few docker containers:

- redis
- redis commander _(useful to debug redis content)_

NextJS handles React HMR. Nodemon handles updates and restarts for Express/backend.

## License

MIT License

Copyright (c) 2019 JSConf Budapest

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
