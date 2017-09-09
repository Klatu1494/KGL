class KGLGrid {
  constructor(container, width, height, tileSides) {
    if (container instanceof HTMLElement) {
      var display = getComputedStyle(container).display;
      if (!(typeof width === "number" && 0 < width)) width = innerWidth;
      if (!(typeof height === "number" && 0 < height)) height = innerHeight;
      if (tileSides != 3 && tileSides != 6) tileSides = 4;
      this.terrainCanvas = document.createElement("canvas");
      this.unitCanvas = document.createElement("canvas");
      this.terrainCanvas.width = unitCanvas.width = width;
      this.terrainCanvas.height = unitCanvas.height = height;
      this.tileSides = tileSides;
    } else throw new Error("container should be an HTMLElement.");
  }

  setGrid(terrainArray, unitsArray) {
    if (array instanceof Array && array.length) {
      var min = array[0].length;
      var length = array.length;
      for (var i = 1; i < length; i++) {
        array[i].filter(a => a instanceof KGLTileType);
        min = Math.min(min, array[i].length);
      }
      this.width = min;
      this.height = length;
      this.tiles = [];
      for (x = 0; x < min; x++) {
        this.grid[x] = [];
        for (var y = 0; y < length; y++) {
          this.grid[x][y] = new KGLTile(x, y, terrainArray[y][x]);
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
    for (var row of this.tiles)
      for (var tile of row) {
        tile.minCost = null;
        tile.parent = null;
        tile.f = null;
      }
    var currentTile = this.tiles[unit.position.x][unit.position.y];
    var adyacentTile;
    var openTiles = [currentTile];
    var closedTiles = [];
    currentTile.f = 0;
    while (openTiles.length) {
      openTiles.sort((a, b) => b.f - a.f);
      currentTile = openTiles.pop();
      if (currentTile.x) {
        adyacentTile = this.tiles[currentTile.x - 1][currentTile.y];
        adyacentTile.parent = currentTile;
        openTiles.push(currentTile);
      }
      if (currentTile.x < this.width - 1) {
        adyacentTile = this.tiles[currentTile.x + 1][currentTile.y];
        adyacentTile.parent = currentTile;
        openTiles.push(currentTile);
      }
      if (this.tileSides == 6) {
        var displacement = currentTile.x % 2 ? 1 : -1;
        if (currentTile.x) {
          adyacentTile = this.tiles[currentTile.x - 1][currentTile.y + displacement];
          adyacentTile.parent = currentTile;
          openTiles.push(currentTile);
        }
        if (currentTile.x < this.width - 1) {
          adyacentTile = this.tiles[currentTile.x + 1][currentTile.y + displacement];
          adyacentTile.parent = currentTile;
          openTiles.push(currentTile);
        }
      }
    }
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
    this.x = x;
    this.y = y;
  }
}