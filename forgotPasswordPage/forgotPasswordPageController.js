({
    showLoginPage : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:loginPage"
        });
        evt.fire();
    },

    showSignupPage : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:signupPage"
        });
        evt.fire();
    },

    sendOTP : function(component, event, helper) {
        if(component.get("v.userNameList").includes(component.get("v.userName"))){
            component.set("v.OTPTruthy","true");

            var action = component.get("c.sendOTPReset");
            action.setParams({
                "uname" : component.get("v.userName"),
                "OTP" : component.get("v.OTP")
            });
            action.setCallback(this, function(response){
                var res = response.getReturnValue();
            });

            $A.enqueueAction(action);
        }
        else{
            component.set("v.userNameTruthy","true");
        }
        
    },

    validateOTP : function(component, event, helper) {
        if(component.get("v.OTP") == component.get("v.VOTP")){
            component.set("v.passWordTruthy", "true");
        }
        else{
            alert('else');
        }
    },

    doInit : function(component, event, helper) {
        component.set("v.OTP", Math.floor(100000 + Math.random() * 900000));
        var userList = [];
        var action = component.get("c.returnUsernameList");
        action.setParams({

        });
        action.setCallback(this, function(response){
            userList = response.getReturnValue();
            component.set("v.userNameList",userList);
        });
        $A.enqueueAction(action);
    }, 

    updatePassword : function(component, event, helper) {
        if(component.get("v.passWord")==component.get("v.conPassword")){
            var action = component.get("c.updatePassword");
            action.setParams({
                "username" : component.get("passWord"),
                "password" : component.get("userName")
            });
            action.setCallback(this, function(response){
                if(response.getReturnValue()=='Success'){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success!",
                        "message": "Password changed succeaafully!!",
                        "type": "success",
                        "duration": "3000"
                    });
                    toastEvent.fire();

                    var evt = $A.get("e.force:navigateToComponent");
                    evt.setParams({
                        componentDef : "c:loginPage"
                    });
                    evt.fire();
                }
                else{
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "message": "Unable to change password. Try again!",
                        "type": "error",
                        "duration": "3000"
                    });
                    toastEvent.fire();

                    var evt = $A.get("e.force:navigateToComponent");
                    evt.setParams({
                        componentDef : "c:forgotPasswordPage"
                    });
                    evt.fire();
                }
            });
        }
        else{
            alert("Confirm password does not match!!");
        }
    }
})