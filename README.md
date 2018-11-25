### To run:

1. Make sure node.js version 8 at least is installed
2. Run `npm i`
3. Run `npm start`
4. Go to `localhost:3000`

### Implementation

Websockets are used for server-client communication. The client sends the map to the backend, and the backend runs the cleaning robot, emitting its state over the websocket. The frontend displays the state over time.

The relevant backend code is under `backend/` and the main part of the UI is in `src/components/Home.tsx`.

### Stack

##### Backend

1. express

##### Frontend

1. TypeScript
1. React
1. MobX
1. Webpack