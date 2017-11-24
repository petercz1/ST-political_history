console.log('loaded frontend app');

var frontend_app = angular.module('presidents_app', ['ui.bootstrap','ui.bootstrap.tpls'])
frontend_app.controller('presidents_data', do_presidents);

function do_presidents($scope, $http) {

  $scope.sortType = 'number'; // set the default sort type
  $scope.sortReverse = false; // set the default sort order
  $scope.show = true; // show alerts  

  $scope.read = function () {
    console.log('getting all presidents');
    $http.get('/api/v1/read').then(
      function (results) {
        //console.log(results);
        $scope.presidents = clean_data(results.data);
      })
  }
  $scope.read();
  $scope.create = function () {
    console.log('creating new president');
    var data = {
      number: $scope.input_number,
      president: $scope.input_name,
      birth_year: $scope.input_birth,
      death_year: 0,
      took_office: $scope.input_took_office,
      left_office: 0,
      party: $scope.party
    }
    $http.post('/api/v1/create', data).then(
      function (result) {
        console.log(result);
        $scope.message = result.data.message;
        $scope.read();
      }
    );

  };
  $scope.update = function (president) {
    console.log('updating president');
    $http.put('/api/v1/update', president).then(
      function (result) {
        console.log(result);
        $scope.message = result.data.message;
        $scope.read();
      }
    )
  };
  $scope.delete = function (president) {
    console.log('deleting president');
    $http.delete('/api/v1/delete/' + president._id).then(
      function (result) {
        console.log(result);
        $scope.message = result.data.message;
        $scope.read();
      }
    )
  };
  $scope.closeAlert = function () {
    console.log('closing alert');
    $scope.show = false;
  }
}

function clean_data(presidents) {

  for (var counter = 0; counter < presidents.length; counter++) {
    // show I have actually got a 'president' object
    //console.log(presidents[counter]);


    // calculate the age in years
    var birth = presidents[counter].birth_year;
    var death = presidents[counter].death_year
    if (death != null) {
      presidents[counter].age = death - birth;
      //presidents[counter].age_alive_now = false;
    } else {
      // get this year - stolen from:
      // https://stackoverflow.com/questions/6002254/get-the-current-year-in-javascript
      presidents[counter].age = (new Date()).getFullYear() - birth;
      //presidents[counter].age_alive_now = true;
    }



    // calculate years in office
    // TODO - account for 2 separate terms eg Cleveland
    // TODO account for leap years
    var start_of_office = new Date(presidents[counter].took_office);
    var end_of_office = new Date(presidents[counter].left_office);
    var time_in_office = end_of_office - start_of_office;
    // 1000 as time is stored in millisconds since midnight Jan 1 1970
    presidents[counter].time_in_office = time_in_office / (60 * 60 * 24 * 365 * 1000);

  }

  return presidents;
}