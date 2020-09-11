const createAllMazeUtil = (mazeSizeV, mazeSizeH) => {
  // Grid of mazeSize
  const grid = [];
  for (let i = 0; i < mazeSizeV; i++) {
    grid.push([]);
    for (let j = 0; j < mazeSizeH; j++) {
      grid[i].push(false);
    }
  }

  // Verticals array 3*2 for 3*3 grid
  const verticalWalls = [];
  for (let i = 0; i < mazeSizeV; i++) {
    verticalWalls.push([]);
    for (let j = 0; j < mazeSizeH - 1; j++) {
      verticalWalls[i].push(false);
    }
  }

  // Horizontal array 2*3 for 3*3 grid
  const horizontalWalls = [];
  for (let i = 0; i < mazeSizeV - 1; i++) {
    horizontalWalls.push([]);
    for (let j = 0; j < mazeSizeH; j++) {
      horizontalWalls[i].push(false);
    }
  }

  return { grid, horizontalWalls, verticalWalls };
};
