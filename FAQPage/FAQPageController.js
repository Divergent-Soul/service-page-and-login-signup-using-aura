({
    showHomePage : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:scorpion"
        });
        evt.fire();
    },

    showLoginPage : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:loginPage"
        });
        evt.fire();
    }
})