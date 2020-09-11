const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

// BoilerPlate
const width = window.innerWidth;
const height = window.innerHeight;
const mazeSizeH = 10;
const mazeSizeV = 10;
const cellSizeX = width / mazeSizeH;
const cellSizeY = height / mazeSizeV;
const wallThickness = 3;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width,
    height,
  },
});
Render.run(render);
Runner.run(Runner.create(), engine);

//Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, {
    isStatic: true,
  }),
  Bodies.rectangle(width / 2, height, width, 2, {
    isStatic: true,
  }),
  Bodies.rectangle(0, height / 2, 2, height, {
    isStatic: true,
  }),
  Bodies.rectangle(width, height / 2, 2, height, {
    isStatic: true,
  }),
];
World.add(world, walls);

// Array Neighbour Shuffle
const shuffle = (arr) => {
  let counter = arr.length;
  while (counter > 0) {
    const index = Math.floor(Math.random() * counter); // returns a random index from [0-counter]
    counter--;
    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  return arr;
};

// Maze Structure generation
const { grid, horizontalWalls, verticalWalls } = createAllMazeUtil(
  mazeSizeV,
  mazeSizeH
);

// console.log(grid);
// console.log(horizontalWalls);
// console.log(verticalWalls);

// random Starting Point
const srcRow = Math.floor(Math.random() * mazeSizeV);
const srcColumn = Math.floor(Math.random() * mazeSizeH);

// Backtracking Algorithm
const startGenerating = (row, column) => {
  if (grid[row][column]) return;
  grid[row][column] = true;

  const neighbours = shuffle([
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"],
  ]);

  for (let neighbour of neighbours) {
    const [nextRow, nextCol, dir] = neighbour;
    // boundary condition
    if (
      nextRow < 0 ||
      nextRow >= mazeSizeV ||
      nextCol < 0 ||
      nextCol >= mazeSizeH
    ) {
      continue;
    }
    // if already visited neighbour
    if (grid[nextRow][nextCol]) {
      continue;
    }
    // check direction
    if (dir === "left") {
      verticalWalls[row][column - 1] = true;
    } else if (dir === "right") {
      verticalWalls[row][column] = true;
    } else if (dir === "up") {
      horizontalWalls[row - 1][column] = true;
    } else if (dir === "down") {
      horizontalWalls[row][column] = true;
    }
    startGenerating(nextRow, nextCol);
  }
};

// Function that creates wall array information
startGenerating(srcRow, srcColumn);

// Drawing the Maze walls
horizontalWalls.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) return;

    const wall = Bodies.rectangle(
      columnIndex * cellSizeX + cellSizeX / 2,
      rowIndex * cellSizeY + cellSizeY,
      cellSizeX,
      wallThickness,
      {
        label: "wall",
        isStatic: true,
        render: {
          fillStyle: "red",
        },
      }
    );
    World.add(world, wall);
  });
});
verticalWalls.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) return;

    const wall = Bodies.rectangle(
      columnIndex * cellSizeX + cellSizeX,
      rowIndex * cellSizeY + cellSizeY / 2,
      wallThickness,
      cellSizeY,
      {
        label: "wall",
        isStatic: true,
        render: {
          fillStyle: "red",
        },
      }
    );
    World.add(world, wall);
  });
});

//Goals
const goal = Bodies.rectangle(
  width - cellSizeX / 2,
  height - cellSizeY / 2,
  cellSizeX / 1.8,
  cellSizeY / 1.8,
  {
    isStatic: true,
    label: "goal",
    render: {
      fillStyle: "green",
    },
  }
);
World.add(world, goal);

//Ball
const ballRadius = Math.min(cellSizeX, cellSizeY) / 3;
const ball = Bodies.circle(cellSizeX / 2, cellSizeY / 2, ballRadius, {
  label: "ball",
  render: {
    fillStyle: "blue",
  },
});
World.add(world, ball);

// Movement
document.addEventListener("keydown", (e) => {
  const { x, y } = ball.velocity;
  if (e.keyCode === 87) {
    Body.setVelocity(ball, { x, y: y - 5 });
  }
  if (e.keyCode === 83) {
    Body.setVelocity(ball, { x, y: y + 5 });
  }
  if (e.keyCode === 65) {
    Body.setVelocity(ball, { x: x - 5, y });
  }
  if (e.keyCode === 68) {
    Body.setVelocity(ball, { x: x + 5, y });
  }
});

//Win Condition
Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    const labels = ["ball", "goal"];
    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      document.querySelector(".winner").classList.remove("hidden");
      world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label === "wall") Body.setStatic(body, false);
        //else if (body.label === "goal") Body.setStatic(body, false);
      });
      // animation
      setTimeout(() => {
        const { x, y } = ball.velocity;
        Body.setVelocity(ball, { x: x - 60, y });
      }, 1200);
    }
  });
});
