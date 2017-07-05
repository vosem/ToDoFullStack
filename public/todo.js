$(document).ready(function(){

    function ToDo (){
        this.model = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')) : [
//            {text: 'defaultTask', status: 'active'},
//            {text: 'secondDefaultTask', status: 'done'},
        ];
        
        this.length = this.model.length;
        this.list = $('.list');
        this.inputField = $('#inputField');
        
        this.init = function(){
            this.renderModel();
            this.addTask();
            this.removeTask();
            this.raiseTask();
            this.comleteTask();
        };
    };

    ToDo.prototype.updateLocalStorage = function () {
        localStorage.setItem('todoList', JSON.stringify(__self.model));
    };
    
    ToDo.prototype.loadModel = function(data){
        __self = this;
        __self.model = data;
        __self.length = data.length;
        __self.list.html('');
        var i = 0;
        data.forEach(function(){
            var index = i+1;
            __self.list.append('<tr><td class="task" data-index="'+index+'">'+ index +'</td><td class="task"  data-index="'+index+'">' +data[i].text+ '</td><td><input class="up" type="button" data-index="'+index+'" value="&#8593"/></td><td><input class="delete" type="button" data-index="'+index+'" value="x"/></td></tr>');
			if(__self.model[index-1].status == 'done'){
                $('td.task[data-index="'+index+'"]').toggleClass('done');
            }
            i++;
        });
        __self.updateLocalStorage();
    };

    ToDo.prototype.renderModel = function(){
        var i = 0;
        __self = this;
        __self.model.forEach(function(){
            var index = i+1;
            __self.list.append('<tr><td class="task" data-index="'+index+'">'+ index +'</td><td class="task"  data-index="'+index+'">' +__self.model[i].text+ '</td><td><input class="up" type="button" data-index="'+index+'" value="&#8593"/></td><td><input class="delete" type="button" data-index="'+index+'" value="x"/></td></tr>');
            if(__self.model[index-1].status == 'done'){
                $('td.task[data-index="'+index+'"]').toggleClass('done');
            }
            i++;
        });
    };
    


    ToDo.prototype.addTask = function(){
        __self = this;

        function insertTask(){
    	  var newTask = __self.inputField.val();    // alternative - document.forms["submitting"].elements["inputField"].value
          var index = __self.length + 1;
          __self.model.push({text: newTask, status: 'active'});
          __self.updateLocalStorage();
          __self.list.append('<tr><td class="task" data-index="'+index+'">'+index+'</td><td class="task" data-index="'+index+'">'+newTask+'</td><td><input class="up" type="button" data-index="'+index+'" value="&#8593"/></td><td><input class="delete" type="button" data-index="'+index+'" value="x"/></td></tr>');
          __self.length++;
          $('#inputField').val("New Task");
          $('#inputButton').attr("disabled", "disabled");
        }

        $('#inputField').on('keypress', function(e){
    		e = e || window.event;
    		if (e.keyCode == 13 && $('#inputField').val() !='') {
    			insertTask();
          }
        }); 


        $('#inputButton').on('click', function(){
            var newTask = __self.inputField.val();    // alternative - document.forms["submitting"].elements["inputField"].value
            var index = __self.length + 1;
            __self.model.push({text: newTask, status: 'active'});
            __self.updateLocalStorage();
            __self.list.append('<tr><td class="task" data-index="'+index+'">'+index+'</td><td class="task" data-index="'+index+'">'+newTask+'</td><td><input class="up" type="button" data-index="'+index+'" value="&#8593"/></td><td><input class="delete" type="button" data-index="'+index+'" value="x"/></td></tr>');
            __self.length++;
            $('#inputField').val("New Task");
            $('#inputButton').attr("disabled", "disabled");
        });        
    };
    
    ToDo.prototype.removeTask = function(){
        __self = this;
        $('.list').on('click', '.delete', function(){
            var index = $(this).data('index') - 1;
            __self.model.splice(index, 1);
            __self.length--;
            __self.list.html('');
            __self.renderModel();
            __self.updateLocalStorage();
        });
    };
    
    ToDo.prototype.raiseTask = function(){
        __self = this;
        $('.list').on('click', '.up', function(){
            var index = $(this).data('index') - 1;
            
            if (index === 0){
                alert('There is only sky above!');
            }
            else{
                var tempPrevElem = __self.model[index-1];
                __self.model[index-1] = __self.model[index];
                __self.model[index] = tempPrevElem;
                __self.updateLocalStorage();
                __self.list.html('');
                __self.renderModel();
            }
        });
    };
    
    ToDo.prototype.comleteTask = function(){
        __self = this;
        $('.list').on('click', '.task', function(){
            var index = $(this).data('index');
            $('td.task[data-index="'+index+'"]').toggleClass('done');
            if (__self.model[index-1].status == 'active'){
                __self.model[index-1].status = 'done';                
            } else{
                __self.model[index-1].status = 'active'; 
            }
            __self.updateLocalStorage();
        });
    };
    
    var toDo = new ToDo();  // window.todo = new ToDo(); ????
    toDo.init();            // window.todo = new ToDo(); ????



  // 1st POST for saveButton
  $('#save').submit(function(e){
    e.preventDefault();
    if(toDo.model.length >= 300){
      alert('Sorry, your ToDo list is to long for saving!')
    } else{

      // Generating unique URls
      var date = new Date();
      var time = date.getTime();
      var secs = new Date().getMilliseconds();
      var coded = window.btoa(time);
      var reCoded = coded.split('').splice(0, (coded.split('').length - 2)).join('');

      $('#saveInputField').val(reCoded);

      var model = JSON.stringify(toDo.model);

      $.ajax
      ({
        type: "POST",
        url: "/submit",
        crossDomain:true, 
        dataType: "json",
        data:{url: reCoded, model: model}
       }).done(function ( data ) {
            console.log(data);
         })
    }
  });

  // 2nd POST for loadButton
  $('#load').submit(function(e){
    e.preventDefault();

    $.ajax
    ({
      type: "POST",
      url: "/load",
      crossDomain:true, 
      dataType: "json",
      data: $(this).serialize()
     }).done(function ( data ) {
          if(data == 'null'){
            alert('Sorry, wrong link!\nPlease, try another one.')
          } else{
            toDo.loadModel(JSON.parse(data));
          }
       })
  });

});