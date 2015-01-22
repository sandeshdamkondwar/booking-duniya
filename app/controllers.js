app.controller('BookingController', ['$scope','$http', BookingController]);

function BookingController ($scope, $http) {
    $http.get("app/data/bookingData.json").success(function(data) {
        $scope.seats = data.seats;
        $scope.selection = data.selection;
        $scope.categories = Object.keys(data.seats);
    });
}