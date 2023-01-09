({
    signUpOnLoad : function(component, event, helper) {
        component.set("v.LOTP", Math.floor(100000 + Math.random() * 900000));
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

    signUpOnSubmit : function(component, event, helper) {
        event.preventDefault();
        var fields = event.getParam('fields');
        if(component.get("v.userNameList").includes(component.find("use").get("v.value"))){
            alert('Username already exists. Try login or use different username!');
        }
        else{
            if(component.get("v.LPassword") == component.find("pas").get("v.value")){
                if(component.get("v.signupTruthy") === false){
                    var action = component.get("c.sendOTP");
    
                    action.setParams({
                        "email" : component.find("ema").get("v.value"),
                        "OTP" : component.get("v.LOTP")
                    });
    
                    action.setCallback(this, function(response){
                        var res = response.getReturnValue();
                    });
    
                    $A.enqueueAction(action);
    
                    component.set("v.signupTruthy","true");
                }
                else{
                    if(component.get("v.LOTP") == component.get("v.VOTP")){
                        component.find("recordEditForm").submit(fields);
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "title": "Success!",
                            "message": "Account created succeaafully!!",
                            "type": "success",
                            "duration": "3000"
                        });
                        toastEvent.fire();
                        component.set("v.signupPageTruthy", "true");
                    }
                    else{
                        component.set("v.signupOTPTruthy", "true");
                    }
                }
            }
            else{
                component.set("v.signupPasswordTruthy", "true");
            }
        }
    },

    showLoginPage : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:loginPage"
        });
        evt.fire();

    },

    showHomePage : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:scorpion"
        });
        evt.fire();
    }
})