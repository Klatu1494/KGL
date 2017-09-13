class KGLGrid {
  constructor(container, width, height, tileSides) {
    if (container instanceof HTMLElement) {
      var display = getComputedStyle(container).display;
      if (!(typeof width === "number" && 0 < width)) width = innerWidth;
      if (!(typeof height === "number" && 0 < height)) height = innerHeight;
      if (tileSides != 3 && tileSides != 6) tileSides = 4;
      this.terrainCanvas = document.createElement("canvas");
      this.unitCanvas = document.createElement("canvas");
      this.terrainCanvas.width = this.unitCanvas.width = width;
      this.terrainCanvas.height = this.unitCanvas.height = height;
      this.tileSides = tileSides;
    } else throw new Error("container should be an HTMLElement.");
  }

  setGrid(terrainArray, unitsArray) {
    if (terrainArray instanceof Array && terrainArray.length) {
      var min = terrainArray[0].length;
      var length = terrainArray.length;
      for (var i = 1; i < length; i++) {
        terrainArray[i].filter(a => a instanceof KGLTileType);
        min = Math.min(min, terrainArray[i].length);
      }
      this.width = min;
      this.height = length;
      this.tiles = [];
      for (var x = 0; x < min; x++) {
        this.tiles[x] = [];
        for (var y = 0; y < length; y++) {
          var currentTile = new KGLTile(x, y, terrainArray[y][x]);
          this.tiles[x][y] = currentTile;
          if (x) {
            currentTile.linkWith(this.tiles[x - 1][y]);
          }
          if (y && (this.tileSides != 3 || (x % 2 == 1) && (y % 2 == 0) || (y % 2 == 1) && (x % 2 == 0))) {
            currentTile.linkWith(this.tiles[x][y - 1])
          }
          if (this.tileSides === 6) {
            if (x) {
              if (x % 2 && y) {
                currentTile.linkWith(this.tiles[x - 1][y - 1]);
              }
              if (x % 2 == 0 && y < this.width - 1) {
                currentTile.linkWith(this.tiles[x - 1][y + 1])
              }
            }
          }
        }
      }
      for (var unit of unitsArray) {
        if (unit.position) {
          if (0 < unit.position.x && unit.x < min && 0 < unit.y && unit.y < length) {
            if (0 <= unit.remainingMovement) this.grid[unit.position.x][unit.position.y].unit = unit;
            else throw new Error("One of your units doesn't have a remainingMovement property or its value is a negative Number.");
          } else throw new Error("One of your units is outside its grid boundaries.");
        } else throw new Error("One of your units doesn't have a position property.");
      }
    } else throw new Error("array should be a KGLTileType Array Array.");
  }

  move(unit, tile) {
    var currentTile = this.tiles[unit.position.x][unit.position.y]
    var openTiles = [];
    var closedTiles = [];
    for (var row of this.tiles)
      for (var tile of row) {
        tile.minCost = null;
        tile.parent = null;
        tile.f = null;
      }
    currentTile.f = 0;
    /*
    TO DO:
    while the open list is not empty
      find the node with the least f on the open list, call it "q"
      pop q off the open list
      generate q 's 8 successors and set their parents to q
      for each successor
        if successor is the goal, stop the search
        successor.g = q.g + distance between successor and q
        successor.h = distance from goal to successor
        successor.f = successor.g + successor.h

        if a node with the same position as successor is in the OPEN list\
        which has a lower f than successor, skip this successor
        if a node with the same position as successor is in the CLOSED list\
        which has a lower f than successor, skip this successor
        otherwise, add the node to the open list
      end
      push q on the closed list
    end
    */
  }
}

class KGLTileType {
  constructor(cost, graphic) {
    this.cost = cost;
    this.graphic = graphic;
  }
}

class KGLTile {
  constructor(x, y, type) {
    this.type = type;
    this.unit = null;
    this.adyacentTiles = new Set();
    this.x = x;
    this.y = y;
  }

  linkWith(tile) {
    this.adyacentTiles.add(tile);
    tile.adyacentTiles.add(this);
  }
}