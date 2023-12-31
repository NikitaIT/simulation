# Simulation

P.S. It was probably worth generating the simulation at "start" and scheduling the dispatch of events with a delay specified in each event. Like `for ... { await delay(events[i].happenedAt - events[i + 1].happenedAt, send, events[i]); }` without any async simulation.

1. Run `npx nx serve`. All tests: `nx run-many --all --target=test`.
2. Open WS connection with `http://localhost:3000/stream`

E2E-like Test with small timeouts: `src/app/routes/start/route.e2e.spec.ts`

P.S. for fast check just set `const isLogged = true;` in this test.

## Or

Build the docker image with `npx nx docker-build nba-node`.

Tip: Modify "docker-build" options in project.json to change docker build args.

Run the container with `docker run -p 3000:3000 -t nba-node`.

## Struct

- framework - core
- domain/match-simulation - logic
- src - application

## Commands format

```json
{
  "type": "START",
  "version": 0,
  "data": {
    "matchIds": ["1", "2", "3"] // <-- it's inmemory hardcoded ids = [Germ&Poland, B&M, A&U]
  }
}
```

```json
{
  "type": "STOP",
  "version": 0,
  "data": {
    "matchIds": ["1", "2", "3"]
  }
}
```

```json
{
  "type": "RESTART",
  "version": 0,
  "data": {
    "matchIds": ["1", "2", "3"]
  }
}
```

## Goal Event format

```json
{
  "type": "GOAL",
  "version": 0,
  "data": {
    "teamId": "Poland",
    "matchId": "1",
    "score": [0, 3],
    "happenedAtSec": 30
  }
}
```

## Start the app

To start the development server run `nx serve .`. Open your browser and navigate to http://localhost:4200/. Happy coding!

## Generate code

If you happen to use Nx plugins, you can leverage code generators that might come with it.

Run `nx list` to get a list of available plugins and whether they have generators. Then run `nx list <plugin-name>` to see what generators are available.

Learn more about [Nx generators on the docs](https://nx.dev/plugin-features/use-code-generators).

## Running tasks

To execute tasks with Nx use the following syntax:

```
nx <target> <project> <...options>
```

You can also run multiple targets:

```
nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/core-features/run-tasks).

## Want better Editor Integration?

Have a look at the [Nx Console extensions](https://nx.dev/nx-console). It provides autocomplete support, a UI for exploring and running tasks & generators, and more! Available for VSCode, IntelliJ and comes with a LSP for Vim users.

## Ready to deploy?

Just run `nx build demoapp` to build the application. The build artifacts will be stored in the `dist/` directory, ready to be deployed.

## Set up CI!

Nx comes with local caching already built-in (check your `nx.json`). On CI you might want to go a step further.

- [Set up remote caching](https://nx.dev/core-features/share-your-cache)
- [Set up task distribution across multiple machines](https://nx.dev/core-features/distribute-task-execution)
- [Learn more how to setup CI](https://nx.dev/recipes/ci)

## Connect with us!

- [Join the community](https://nx.dev/community)
- [Subscribe to the Nx Youtube Channel](https://www.youtube.com/@nxdevtools)
- [Follow us on Twitter](https://twitter.com/nxdevtools)
