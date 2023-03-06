const numDisks = 4;
let moves = 0;
const towers = document.querySelectorAll(".tower");

// initialize the game
function init() {
  // add event listeners to the disks
  const disks = document.querySelectorAll(".disk");
  disks.forEach(function (disk) {
    disk.addEventListener("dragstart", dragStart);
    disk.addEventListener("dragend", dragEnd);
  });
  // modifying the weight of the disks
    for (let i = 0; i < disks.length; i++) {
      disks[i].style.width = 250 - 50 * i + "px";
    }
}

// handle the start of a drag
function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
  event.target.classList.add("dragging");
}

// handle the end of a drag
function dragEnd(event) {
  event.target.classList.remove("dragging");
}

// handle a drop onto a tower
function drop(event) {
  event.preventDefault();

  const disk = document.querySelector(".dragging");
  const fromTower = disk.parentNode;
  const toTower = event.target.closest(".tower");
  if (canMoveDisk(disk, fromTower, toTower)) {
    moveDisk(fromTower, toTower);
    movementTag.innerHTML = moves;
    checkWin();
  }
}

// check if a move is valid
function canMoveDisk(disk, from, to) {
  if (from === to) {
    return false;
  }
  const fromDisks = from.querySelectorAll(".disk");
  const toDisks = to.querySelectorAll(".disk");
  if (fromDisks.length === 0) {
    return false;
  }
  if (
    toDisks.length > 0 &&
    parseInt(fromDisks[fromDisks.length - 1].style.width) >=
      parseInt(toDisks[toDisks.length - 1].style.width)
  ) {
    return false;
  }
  // check if the disk is the last one in the tower
  if (disk !== fromDisks[fromDisks.length - 1]) {
    return false;
  }
  return true;
}

// move a disk from one tower to another
function moveDisk(from, to) {
  const disk = from.querySelector(".disk:last-child");
  to.appendChild(disk);
  moves++;
}

// update the number of moves
const movementTag = document.querySelector("#movements");


// check if the game is won
function checkWin() {
  if (towers[2].querySelectorAll(".disk").length === numDisks) {
    alert("Congratulations! You won in " + moves + " moves.");
  }
}
// start the game
init();
// add event listeners to the towers
towers.forEach(function (tower) {
  tower.addEventListener("dragover", function (event) {
    event.preventDefault();
  });
  tower.addEventListener("drop", drop);
});

// append the solution to div tag with id "guide"
function writeSolution(numDisks, from, to, aux) {
  const fullSteps = [];
  if (numDisks === 1) {
    fullSteps.push("Move disk 1 from tower " + from + " to tower " + to);
    return fullSteps;
  }
  fullSteps.push(...writeSolution(numDisks - 1, from, aux, to));
  fullSteps.push("Move disk " + numDisks + " from tower " + from + " to tower " + to);
  fullSteps.push(...writeSolution(numDisks - 1, aux, to, from));
  return fullSteps;
}

const guide = document.querySelector("#guide");
const solution = writeSolution(numDisks, 1, 3, 2);

solution.forEach(function (step) {
  const stepTag = document.createElement("p");
  stepTag.innerHTML = step;
  guide.appendChild(stepTag);
});
