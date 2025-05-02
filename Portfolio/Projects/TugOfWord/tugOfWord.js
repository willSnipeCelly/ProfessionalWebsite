document.addEventListener("DOMContentLoaded", function() {
	const grid = document.getElementById('gameGrid');
      
	// Create the initial row (row 0) with a random center letter
  const centerCol = 10;  // 0-based index for center column
  const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  for (let i = 0; i < 20; i++) {
    const cellDiv = document.createElement('div');
    cellDiv.className = 'cell';
    const input = document.createElement('input');
    input.maxLength = 1;
    input.autocapitalize = 'characters';
    input.spellcheck = false;
    if (i === centerCol) {
          input.value = randomLetter;
          input.readOnly = true;
          input.classList.add('locked');
    }
    input.addEventListener('input', function() {
          this.value = this.value.toUpperCase().substring(0, 1);
    });
		cellDiv.appendChild(input);
    grid.appendChild(cellDiv);
  }

      // Click handler: clicking a letter cell inserts a new row below
      grid.addEventListener('click', function(e) {
        const clickedInput = e.target;
        if (clickedInput.tagName === 'INPUT' && clickedInput.value !== '') {
          const children = Array.from(grid.children);
          const index = children.indexOf(clickedInput.parentElement);
          const row = Math.floor(index / 20);
          const col = index % 20;
          const letter = clickedInput.value.toUpperCase();
          const newRowIndex = row + 1;
          
          // Create new row of 20 cells
          const newRowCells = [];
          for (let i = 0; i < 20; i++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            const newInput = document.createElement('input');
            newInput.maxLength = 1;
            newInput.autocapitalize = 'characters';
            newInput.spellcheck = false;
            if (i === col) {
              newInput.value = letter;
              newInput.readOnly = true;
              newInput.classList.add('locked');
            }
            newInput.addEventListener('input', function() {
              this.value = this.value.toUpperCase().substring(0, 1);
            });
            cellDiv.appendChild(newInput);
            newRowCells.push(cellDiv);
          }
          // Insert the new row into the grid
          const insertBeforeNode = grid.children[newRowIndex * 20];
          if (insertBeforeNode) {
            // Insert cells in reverse order to maintain correct sequence
            for (let j = newRowCells.length - 1; j >= 0; j--) {
              grid.insertBefore(newRowCells[j], insertBeforeNode);
            }
          } else {
            // No row below; just append
            newRowCells.forEach(cell => grid.appendChild(cell));
          }

          // Focus on an adjacent empty cell (prefer left of the locked letter)
          const focusCol = (col > 0 ? col - 1 : 1);
          const focusIndex = newRowIndex * 20 + focusCol;
          const focusCell = grid.children[focusIndex];
          if (focusCell) {
            const focusInput = focusCell.querySelector('input');
            if (focusInput) focusInput.focus();
          }
		}
	});
});