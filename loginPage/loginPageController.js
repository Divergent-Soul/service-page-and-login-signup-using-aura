({
    userLogin : function(component, event, helper) {
        
        var uname = component.get("v.Username");
        var upass = component.get("v.Password");
        var action = component.get("c.userValidation");

        action.setParams({
            username : uname,
            password : upass
        });
        
        action.setCallback(this, function(response){
            var res = response.getReturnValue();
            if(res == 'Success'){
                var action1 = component.get("c.returnUser");

                action1.setParams({
                    username : uname
                });

                action1.setCallback(this, function(response1){
                    var userDetails = response1.getReturnValue();
                    component.set("v.User",userDetails);
                    
                    var appEvent = $A.get("e.c:appEvent");
                    appEvent.setParams({
                        "user" : userDetails,
                        "pageTruthy" : true
                    });
                    appEvent.fire();

                });

                $A.enqueueAction(action1);
                component.set("v.uname",'');
                component.set("v.pass",'');

            }
            else if(res === 'Invalid Password'){
                component.set("v.ErrorMsg","*Entered password is wrong. To reset the password, click on Forgot Password!");
            }
            else if(res === 'User does not exist'){
                component.set("v.ErrorMsg","*User does not exists. To create new account, click on Sign Up!");
            }

        });

        $A.enqueueAction(action);
        
    },

    signUpBtnOnclick : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:signupPage"
        });
        evt.fire();
    },

    forgotPassword : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:forgotPasswordPage"
        });
        evt.fire();
    },

    showHomePage : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:scorpion"
        });
        evt.fire();
    },

    redirectServicePage : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:endApp"
        });
        evt.fire();
    }

})