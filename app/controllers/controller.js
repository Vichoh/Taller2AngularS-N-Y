'use strict';

(function () {
	angular
	.module('app')


	.controller('principalCtr' , ['$scope' , 'localStorageService', function($scope, localStorageService){


	    // creo una varible id la cual me permitira identificar si estoy creando un nuevo
	      	//cliente o actualizo uno ya existente (-1 nuevo  diferente actualizar)
	      	$scope.id = -1;
	      	

		// incrusto la vista inicial
		$scope.menu='app/views/clientes.html';

	     //cambiar entre paneles
	     $scope.cambioVista= function (menu) {
	     	
	     	$scope.menu='app/views/'+menu+'.html';
	     };


	     
	     

	// funcion que me permite al clickear en agregar cliente darle valor al id como -1
      	// para referiar a un nuevo cliente tambien me lleva al panel del formulario de agre cliente
      	$scope.setMenu= function (menu) {
      		$scope.id = -1;
      		$scope.menu='app/views/'+menu+'.html';
      		$scope.telefonoCliente = "";
      		$scope.nombreCliente = "";
      		$scope.emailCliente = "";
      	};


    		  	/*
		**me permite que al presionar el boton de actualizar ir al formulario de agregar un nuevo cliente
		, cambio el id para identificar un update y no un nuevo usuario, y le doy valores a las casillas
		para que al entrar al formulario de nuevo cliente contengan los valores cliente a actualizar
		*/
		$scope.formCliente= function (menu,id) {
			$scope.clientes = localStorageService.get("angular-todolist");
			$scope.menu='app/views/'+menu+'.html';
			$scope.telefonoCliente = $scope.clientes[id].telefono;
			$scope.nombreCliente = $scope.clientes[id].nombreCompleto;
			$scope.emailCliente = $scope.clientes[id].email;
			$scope.id = id;
		    //console.log($scope.id);
		  };

		/*
		me permite ir a la ventana que registra las cuotas por cliente y me permite pagar
		*/
		$scope.goPagos= function (vista,id) {
			$scope.idClienteEstado = id;
			if (localStorageService.get("lssDeuda")) {

				$scope.deudas = localStorageService.get("lssDeuda");

				$scope.newObtCuota = $scope.deudas[id];

			}else{
				$scope.deudas =[];


			};
			$scope.cambioVista(vista);
			console.log("asdasdas");
			console.log($scope.newObtCuota);
			
		};





/*
   ** los siguientes 3 if me permiten que al actualizar la pagina si el localstorage tiene valores 
  se los paso a sus respectivas 
  */

  if (localStorageService.get("lssCapital") ) {

  	$scope.capital = localStorageService.get("lssCapital");

  }else{
  	$scope.capital = 15000000;
  };    
  

  

  

  if (localStorageService.get("angular-todolist")) {

  	$scope.clientes = localStorageService.get("angular-todolist");
  	
  }else{

  	$scope.clientes = [];
  	
  }

  if (localStorageService.get("lssDeuda")) {

  	$scope.deudas = localStorageService.get("lssDeuda");

  	console.log($scope.deudas);

  }else{
  	$scope.deudas =[];


  }; 

// funcion para poder actulizar en tiempo real el capital

$scope.consultCapital = function (){

	if (localStorageService.get("lssCapital") ) {

		$scope.capital = localStorageService.get("lssCapital");

	}else{
		$scope.capital = 15000000;
	};
};




}])




	.controller('clienteCtrl', ['$scope', 'localStorageService', function($scope, localStorageService){

		if (localStorageService.get("angular-todolist")) {

			$scope.clientes = localStorageService.get("angular-todolist");
			
		}else{

			$scope.clientes = [];
			
		}

    	//elimina un cliente
    	$scope.clean = function(id){
    		console.log(id);  
    		$scope.clientes.splice(id ,1);
    		localStorageService.set("angular-todolist",$scope.clientes);
    		
    	};


    	


    }])





	.controller('addClientCtrl', ['$scope', 'localStorageService', function($scope, localStorageService){

		
		$scope.newClie = {};
		/*
		**funcion que me permitira agregar o editar un nuevo cliente segun corresponda el valor del id
		*/
		$scope.addCliente = function(cliente){

			if (localStorageService.get("angular-todolist")) {

				$scope.clientes = localStorageService.get("angular-todolist");
				
			}else{

				$scope.clientes = [];
				
			}

			
			if ($scope.id  == -1) {
				$scope.clientes.push(cliente);
				
			}else{
				console.log(cliente.nombreCompleto);
				console.log(cliente.email);
				console.log(cliente.telefono);
				if (typeof(cliente.nombreCompleto) === "undefined") {
				    //alert("objetoso no está definido.");
				  }else{
				  	$scope.clientes[$scope.id].nombreCompleto = cliente.nombreCompleto;
				  };
				  if (typeof(cliente.email) === "undefined") {
				    //alert("objetoso no está definido.");
				  }else{
				  	$scope.clientes[$scope.id].email = cliente.email;
				  };
				  if (typeof(cliente.telefono) === "undefined") {
				   // alert("objetoso no está definido.");
				 }else{
				 	$scope.clientes[$scope.id].telefono = cliente.telefono;
				 };
				 

				 
				 
				};

				localStorageService.set("angular-todolist",$scope.clientes);
				$scope.cambioVista("clientes");
				
			};

		}])






	.controller('prestamoCtrl', ['$scope', 'localStorageService', function($scope, localStorageService){

		if (localStorageService.get("angular-todolist")) {

			$scope.clientes = localStorageService.get("angular-todolist");
			
		}else{

			$scope.clientes = [];
			
		}


		$scope.consultCapital();
		// estructura de cuotas
		var cuotas =  [{
			id: 1,
			n_cuotas: 1,
			interes: 0
		},{
			id: 2,
			n_cuotas: 3,
			interes: 6
		},{
			id: 3,
			n_cuotas: 6,
			interes: 15
		},{
			id: 4,
			n_cuotas: 9,
			interes: 25
		}];


	   	// asigno la estructura de cuotas a una variable
	   	$scope.tipoCuotas = cuotas;
		// variables para hacer el jeugo de cambiar el texto de los menus desplegables de prestamo
		$scope.nomCliente = "Cliente";
		$scope.cuot = "Cuotas";

		var idCliente ;
		var idCuota;

		//funciones que me permiten cambiar el texto a los menus desplegables de prestamo
		$scope.addNomCliente = function(id){
			idCliente=id;
			$scope.nomCliente = $scope.clientes[id-1].nombreCompleto; 
			
		};

		$scope.addcantCuota = function(id){
			idCuota=id;
			for (var i = 0; i < cuotas.length; i++) {
				if (id == $scope.tipoCuotas[id-1].id) {
					$scope.cuot = $scope.tipoCuotas[id-1].n_cuotas; 
				};
			};
			
		};



		/*
		  creo una nueva deuda llamada newDeudas la cual agregare a deudas con un push
		  */
		  $scope.newDeudas = {};
		  $scope.generarPrestamo = function(){

		  	if (localStorageService.get("lssCapital") ) {

		  		$scope.capital = localStorageService.get("lssCapital");

		  	}else{
		  		$scope.capital = 15000000;
		  	};    

		  	if (localStorageService.get("lssDeuda")) {

		  		$scope.deudas = localStorageService.get("lssDeuda");

		  		console.log($scope.deudas);

		  	}else{
		  		$scope.deudas =[];


		  	}; 

		  	$scope.newDeudas.cliente = $scope.clientes[idCliente-1];
		  	$scope.newDeudas.cuota_id = $scope.tipoCuotas[idCuota-1].id;
		  	$scope.newDeudas.cuotas = generarCuotas();
		  	$scope.newDeudas.total = calculoTotal($scope.newDeudas.prestamo);
		  	console.log($scope.newDeudas);

		  	$scope.deudas.push($scope.newDeudas);
		  	$scope.capital = $scope.capital-$scope.newDeudas.prestamo;

		  	localStorageService.set("lssDeuda",$scope.deudas);
		  	localStorageService.set("lssCapital",$scope.capital);
		  	
		  	$scope.cambioVista('deudas');
		  };

		/*
		calculo de el valor del prestamo con su interes correspondiente
		*/
		var calculoTotal = function(prestamo){
			return (prestamo*($scope.tipoCuotas[idCuota-1].interes/100))+prestamo;
		}


		/*
		genera las cuotas para cada prestamo
		*/

		var generarCuotas = function(){
			$scope.newCuotas =[];
			$scope.newCuota ={};
			for (var i = 0; i < $scope.tipoCuotas[idCuota-1].n_cuotas; i++) {
				$scope.newCuota.valor = calculoTotal($scope.newDeudas.prestamo)/$scope.tipoCuotas[idCuota-1].n_cuotas;
				$scope.newCuota.pagado = false;
				$scope.newCuotas.push($scope.newCuota);
			};
			
			return $scope.newCuotas;
		};





	}])





	.controller('deudasCtrl', ['$scope', 'localStorageService', function($scope, localStorageService){

		
		if (localStorageService.get("lssDeuda")) {

			$scope.deudas = localStorageService.get("lssDeuda");

		      //console.log($scope.deudas);

		    }else{
		    	$scope.deudas =[];


		    }; 

		    $scope.consultCapital();

		/*
		calcula la deuda actualizada de cada cliente
		*/
		$scope.deudaActual =function(deuda){
			var total =0;
			for (var i = 0; i < deuda.cuotas.length; i++){

				if (!deuda.cuotas[i].pagado) {
					total =total + deuda.cuotas[i].valor;
				};

			};
			return total;
		}
		/* 
		deuta actual de todos los clientes
		*/
		$scope.deudaTotal = function (){
			var total =0;
			for (var i = 0; i < $scope.deudas.length; i++) {

				total = total + $scope.deudaActual($scope.deudas[i]);
				
			};
		 // console.log(total);
		 return total;
		};


		//$scope.idClienteEstado;
		//$scope.newObtCuota
		console.log($scope.newObtCuota);

		


		/*
		cancela la cuota en false atrue  y actualiza en los lugares correspondientes
		*/

		$scope.pagarCuota = function(id){
			
			
			$scope.newObtCuota.cuotas[id].pagado = true;
			$scope.deudas[$scope.idClienteEstado] = $scope.newObtCuota;
			$scope.capital = $scope.capital + $scope.newObtCuota.cuotas[id].valor;
			localStorageService.set("lssDeuda",$scope.deudas);
			localStorageService.set("lssCapital",$scope.capital);
			
			$scope.consultCapital();
		};

		/*
		transforma el estado de la cuota ya sea false o true
		*/
		$scope.estadoCuota = function(estado){
			var respuesta = "Pagada";
			if (!estado) {
				respuesta = "Por pagar";
			};
			return respuesta;
		};


		


	}])




})();