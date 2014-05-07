(function(){

  // Declaring class "Timer"
  var Timer = function() {
    // Property: Frequency of elapse event of the timer in millisecond
    this.Interval = 1000;

    // Property: Whether the timer is enable or not
    this.Enable = new Boolean(false);

    // Event: Timer tick
    this.Tick;

    // Member variable: Hold interval id of the timer
    var timerId = 0;

    // Member variable: Hold instance of this class
    var thisObject;

    // Function: Start the timer
    this.Start = function()
    {
      this.Enable = new Boolean(true);

      thisObject = this;
      if (thisObject.Enable)
      {
        thisObject.timerId = setInterval(
        function()
        {
          thisObject.Tick();
        }, thisObject.Interval);
      }
    };

    // Function: Stops the timer
    this.Stop = function()
    {
      thisObject.Enable = new Boolean(false);
      clearInterval(thisObject.timerId);
    };
  };

  var Cell = function() {
    this.value = null;
    this.open = false;
    this.flagged = false;
  };

  var updateMineCount = function(delta) {
    mineCount += delta;

    var minesAsText = mineCount.toString();
    while(minesAsText.length < 3) {
      minesAsText = "0" + minesAsText;
    }
    mineCountEl.innerText = minesAsText;
  };

  var clicked = function() {
    console.log('clicked');

    //flagged
    if(cells[this.dataset.row][this.dataset.column].flagged) {
      return;
    }
    //number showing, reveal around
    else if(cells[this.dataset.row][this.dataset.column].open) {
      return revealMany(this);
    }
    //reveal number
    else {
      return revealOne(this);
    }
  };

  var revealMines = function() {

    console.log('MINE');

    clock.Stop();

    faceEl.classList.add('dead');

    minesList.forEach(function(mine){
      var el = document.querySelector("[data-row='" + mine.row + "'][data-column='" + mine.column + "']");
      if(!cells[mine.row][mine.column].flagged) {
        el.classList.add('open');
        el.classList.add('red');
        el.classList.add('mine');
      }
    });

    tdList.forEach(function(td){
      td.removeEventListener('click', clicked, false);
      td.removeEventListener('contextmenu', right_clicked, false);
      td.removeEventListener('mousedown', faceOOO, false);
      td.removeEventListener('mouseup', faceSmile, false);
    });
  };

  var revealMany = function(self) {
    console.log('reveal many');

    var row = Number(self.dataset.row),
        col = Number(self.dataset.column);

    if((row-1) >= 0) {
      if((col-1) >= 0)
        revealOne(document.querySelector("[data-row='" + (row-1) + "'][data-column='" + (col-1) + "']"));

      revealOne(document.querySelector("[data-row='" + (row-1) + "'][data-column='" + col + "']"));

      if((col+1) < tableSize)
        revealOne(document.querySelector("[data-row='" + (row-1) + "'][data-column='" + (col+1) + "']"));
    }

    if((col-1) >= 0)
      revealOne(document.querySelector("[data-row='" + row + "'][data-column='" + (col-1) + "']"));
    if((col+1) < tableSize)
      revealOne(document.querySelector("[data-row='" + row + "'][data-column='" + (col+1) + "']"));

    if((row+1) < tableSize){
      if((col-1) >= 0)
        revealOne(document.querySelector("[data-row='" + (row+1) + "'][data-column='" + (col-1) + "']"));

      revealOne(document.querySelector("[data-row='" + (row+1) + "'][data-column='" + col + "']"));

      if((col+1) < tableSize)
        revealOne(document.querySelector("[data-row='" + (row+1) + "'][data-column='" + (col+1) + "']"));
    }
  };

  var revealOne = function(self) {
    console.log('reveal one');

    if(firstClick) {
      clock.Start();
      firstClick = false;
      cells[self.dataset.row][self.dataset.column].value = 0;
      fillBoard(self);
    }

    if(cells[self.dataset.row][self.dataset.column].value === "mine" &&
       !cells[self.dataset.row][self.dataset.column].flagged) {
      return revealMines();
    } else if (cells[self.dataset.row][self.dataset.column].open) {
      return;
    } else if (cells[self.dataset.row][self.dataset.column].flagged) {
      return;
    } else {
      cells[self.dataset.row][self.dataset.column].open = true;
      self.classList.add(numberToString(cells[self.dataset.row][self.dataset.column].value));
      self.classList.add('open');
      openList.push({
        column: self.dataset.column,
        row: self.dataset.row,
      });

      if(cells[self.dataset.row][self.dataset.column].value === 0) {
        revealMany(self);
      }
    }

    if(openList.length + minesList.length === tableSize * tableSize) {
      return winning();
    }
  };

  var winning = function() {
    clock.Stop();
    faceEl.classList.add('dude');


    tdList.forEach(function(td){
      td.removeEventListener('click', clicked, false);
      td.removeEventListener('contextmenu', right_clicked, false);
      td.removeEventListener('mousedown', faceOOO, false);
      td.removeEventListener('mouseup', faceSmile, false);
    });
  };

  var numberToString = function(number) {
    switch(number) {
      case 1:
        return "one";
      case 2:
        return "two";
      case 3:
        return "three";
      case 4:
        return "four";
      case 5:
        return "five";
      case 6:
        return "six";
      case 7:
        return "seven";
      case 8:
        return "eight";
      default:
        return "zero";
    }
  };

  var fillBoard = function(self) {
    fillMines(self);
    fillNumbers(self);
  };

  var fillMines = function(self) {
    var mines = mineCount,
        col = self.dataset.column,
        row = self.dataset.row;

    while(mines > 0) {
      var c = Math.floor(Math.random() * tableSize);
      var r = Math.floor(Math.random() * tableSize);

      if(cells[r][c].value === null) {
        mines--;
        cells[r][c].value = "mine";
        minesList.push({
          row: r,
          column: c,
        });
      }
    }
  };

  var fillNumbers = function(self) {
    for(var row = 0; row < tableSize; row++) {
      for(var column = 0; column < tableSize; column++) {
        if(cells[row][column].value !== "mine") {
          var arr = [];

          if(row-1 >= 0) {
            if(column-1 >= 0)
              arr.push(cells[row-1][column-1].value);

            arr.push(cells[row-1][column].value);

            if(column+1 < tableSize)
              arr.push(cells[row-1][column+1].value);
          }

          if(column-1 >= 0)
            arr.push(cells[row][column-1].value);
          if(column+1 < tableSize)
            arr.push(cells[row][column+1].value);

          if(row+1 < tableSize){
            if(column-1 >= 0)
              arr.push(cells[row+1][column-1].value);

            arr.push(cells[row+1][column].value);

            if(column+1 < tableSize)
              arr.push(cells[row+1][column+1].value);
          }

          var count = 0;
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] === "mine") {
              count++;
            }
          }

          cells[row][column].value = count;
        }
      }
    }
  };

  var right_clicked = function() {
    console.log('double clicked');
    event.stopPropagation();
    event.preventDefault();

    if(cells[this.dataset.row][this.dataset.column].open) {
      return;
    }
    if(cells[this.dataset.row][this.dataset.column].flagged) {
      cells[this.dataset.row][this.dataset.column].flagged = false;
      updateMineCount(1);
      this.classList.remove('flagged');
    } else {
      cells[this.dataset.row][this.dataset.column].flagged = true;
      updateMineCount(-1);
      this.classList.add('flagged');
    }
    return false;
  };

  var faceOOO = function() {
    faceEl.classList.add('ooo');
  };

  var faceSmile = function() {
    faceEl.classList.remove('ooo');
  };

  var init = function() {
    tableEl.id = "field";
    controlsEl.id = "controls";
    timeEl.id = "time";
    mineCountEl.id = "mine-count";
    faceEl.id = "face";

    controlsEl.appendChild(timeEl);
    controlsEl.appendChild(faceEl);
    controlsEl.appendChild(mineCountEl);

    gameEl.appendChild(controlsEl);
    gameEl.appendChild(tableEl);

    timeEl.innerText = "000";

    clock.Tick = function() {
      time++;
      var timeAsText = time.toString();
      while(timeAsText.length < 3) {
        timeAsText = "0" + timeAsText;
      }
      timeEl.innerText = timeAsText;
    };

    updateMineCount(0);

    for(var i = 0; i < tableSize; i++) {
      cells[i] = new Array(tableSize);
    }

    for(var row = 0; row < tableSize; row++) {
      var tr = document.createElement('tr');

      for(var column = 0; column < tableSize; column++) {
        var td = document.createElement('td');

        td.dataset.row = row;
        td.dataset.column = column;
        cells[row][column] = new Cell();

        td.addEventListener('click', clicked, false);
        td.addEventListener('contextmenu', right_clicked, false);
        td.addEventListener('mousedown', faceOOO, false);
        td.addEventListener('mouseup', faceSmile, false);

        tdList.push(td);
        tr.appendChild(td);
      }
      tableEl.appendChild(tr);
    }

    faceEl.addEventListener('click', function(){
      location.reload(false);
    }, false);
  };


  var tableSize = 10,
      firstClick = true,
      mineCount = Math.floor(tableSize * tableSize * 0.2),
      clock = new Timer(),
      time = 0,
      minesList = [],
      openList = [],
      flaggedList = [],
      tdList = [],
      cells = new Array(tableSize),
      tableEl = document.createElement('table'),
      controlsEl = document.createElement('div'),
      timeEl = document.createElement('div'),
      mineCountEl = document.createElement('div'),
      faceEl = document.createElement('div'),
      gameEl = document.getElementById('game');

  init();
})();