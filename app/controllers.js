app.controller('BookingController', ['$scope','$http', BookingController]);

function BookingController ($scope, $http) {
    "use strict";
    $http.get("app/data/bookingData.json").success(function(data) {
        $scope.seats = data.seats;
        $scope.selection = data.selection;
        $scope.categories = Object.keys(data.seats);
        $scope.screenDistance = data.screenDistance;

        $scope.selectSeat = function() {
            $scope.visible = !$scope.visible;
        };

        $scope.resetSelection = function () {
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
            }
        };
    });
}