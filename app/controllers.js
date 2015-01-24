app.controller('BookingController', ['$scope','$http', BookingController]);

function BookingController ($scope, $http) {
    "use strict";
    $http.get("app/data/bookingData.json").success(function(data) {
        $scope.seats = data.seats;
        $scope.selection = data.selection;
        $scope.categories = Object.keys(data.seats);
        $scope.screenDistance = data.screenDistance;

        $scope.resetSelection = function () {
            // Make seat.booked = false for each seat we had selected
            for (var i = 0; i < $scope.selection.seats.length; i++) {
                var row = $scope.selection.seats[i].row;
                var number = $scope.selection.seats[i].number;
                var category = $scope.selection.seats[i].category;

                for (var j = 0; j < $scope.seats[category][row].length; j++) {
                    if (number === $scope.seats[category][row][j].number) {
                        $scope.seats[category][row][j].booked = false;
                        break;
                    }
                }
            }

            $scope.selection.seats = [];
            $scope.selection.complete = false;
        };

        $scope.bookTickets = function () {
            var selectedSeat = this.seat;
            if (selectedSeat.hidden === true || selectedSeat.available === false) return;

            var quantity = $scope.quantity,
                selectedSeatNumber = selectedSeat.number,
                selectedRow = this.row,
                categorySelected = $scope.categorySelected;

            // Clear out the previous selection
            if ($scope.selection.complete === true) {
                $scope.resetSelection();
            }

            var seatsInRow = $scope.seats[categorySelected][selectedRow];

            var booked = $scope.selection.seats.length;
            for (var i = 0; i < seatsInRow.length && booked < quantity; i++) {
                // Stop booking further tickets if not available or hidden
                if (seatsInRow[i].number > selectedSeatNumber && (seatsInRow[i].available === false || seatsInRow[i].hidden === true)) break;

                if (seatsInRow[i].hidden === true || seatsInRow[i].number < selectedSeatNumber) continue;

                // Select the ticket
                $scope.selection.seats.push({
                    row: selectedRow,
                    number: seatsInRow[i].number,
                    category: categorySelected
                });

                console.log(selectedRow, seatsInRow[i].number);

                seatsInRow[i].booked = true;
                booked++;
            }

            // Mark as complete if selected tickets equals to quatity required
            if (booked === quantity) {
                $scope.selection.complete = true;
                if (!isValidSelection()) {
                    $scope.resetSelection();
                    $scope.selectionInvalid = true;
                    shakeWarning();
                    return;
                }
            }

            $scope.selectionInvalid = false;
        };

        function shakeWarning () {
            $(".selection-invalid")
                .addClass('shake')
                .delay(1000)
                .queue(function() {
                    $(this).removeClass("shake");
                    $(this).dequeue();
                });
        }

        function findWithAttr(array, attr, value) {
            for (var i = 0; i < array.length; i += 1) {
                if (array[i][attr] === value) {
                    return i;
                }
            }
        }

        function isValidSelection () {
            // Checking single seat silos effect
            // look on right or left two times one by one
            // If there is just single seat avilable on left side
            //     then go for right side to check
            //     If there is just single seat avilable on right side
            //         Make $scope.selectionInvalid true
            //     Else make $scope.selectionInvalid false
            // Else $scope.selectionInvalid false

            // Get starting point
            // There might be two rows selected/ Multiple selections
            // There will be a problem in last selection only for sure
            // So get the row id of the last seat
            // and check the lowest consecutive number in that row

            var lastSeat = $scope.selection.seats[$scope.selection.seats.length - 1];
            var rowId = lastSeat.row;
            var lastNumber = lastSeat.number;
            var firstNumber = lastNumber;
            var category = lastSeat.category;

            for (var i = $scope.selection.seats.length - 1;
                    i >= 1 && ($scope.selection.seats[i] !== undefined && $scope.selection.seats[i].row === rowId);
                    i--, firstNumber--) {
                var previousSeat = $scope.selection.seats[i - 1];
                if (previousSeat.row === rowId && previousSeat.number === firstNumber - 1) continue;
                else break; // We got firstNumber here
            }

            // Now in rowId row check if there is just one seat on the left
            var seatIndex = findWithAttr($scope.seats[category][rowId], 'number', firstNumber);
            var prevSeat = $scope.seats[category][rowId][seatIndex - 1];
            var prevToPrevSeat = $scope.seats[category][rowId][seatIndex - 2];

            if (prevSeat && !prevSeat.hidden && prevSeat.available &&
                (!prevToPrevSeat || prevToPrevSeat.hidden || !prevToPrevSeat.available)) {
                // Now in rowId row check if there is just one seat on the right
                seatIndex = findWithAttr($scope.seats[category][rowId], 'number', lastNumber);
                var nextSeat = $scope.seats[category][rowId][seatIndex + 1];
                var nextToNextSeat = $scope.seats[category][rowId][seatIndex + 2];
                console.log(prevSeat, prevToPrevSeat, nextSeat, nextToNextSeat);
                if (nextSeat && !nextSeat.hidden && nextSeat.available &&
                    (!nextToNextSeat || nextToNextSeat.hidden || !nextToNextSeat.available)) {
                    return false;
                }
            }

            return true;
        }
    });
}