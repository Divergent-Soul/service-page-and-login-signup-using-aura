({
    showLoginPage : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:loginPage"
        });
        evt.fire();
    },

    FAQPage : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:FAQPage"
        });
        evt.fire();
    }
})