({
    recordCreated : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "message": "Ticket has been created successfully.",
            "type": "success",
            "duration": "3000"
        });
        toastEvent.fire();

        var action = component.get("c.recordCreationEmail");
        action.setParams({
            "userId" : component.get("v.userId")
        });
        action.setCallback(this, function(response){
            var res = response.getReturnValue();
        });
        $A.enqueueAction(action);

        
        $A.enqueueAction(component.get("c.fetchCase"));
        
    },

    handleReset: function(component, event, helper) {
        component.find('field').forEach(function(f) {
            f.reset();
        });
    },

    handleApplicationEvent : function(component, event, helper) {
        var userDetail = event.getParam("user");
        // set the handler attributes based on event data
        component.set("v.user", userDetail);
        component.set("v.userId", userDetail.Id);
        component.set("v.userPosition", userDetail.Position__c);
        component.set("v.userName", userDetail.Name__c);

        var userPosition = userDetail.Position__c;
        if(userPosition === 'End User'){
            component.set("v.UATruthy",true);
            component.set("v.mycolumns", [
                {label: "Case Number", fieldName: "CaseNumber", type: "text"},
                {label: "Subject", fieldName: "Subject", type: "text"},
                {label: "Status", fieldName: "Status", type: "text"},
                {type: "button", typeAttributes: {
                    label: "View",
                    name: "View",
                    title: "View",
                    disabled: false,
                    value: "view",
                    iconPosition: "center"
                }},
                {type: "button", typeAttributes: {
                    label: "Close Ticket",
                    name: "Close",
                    disabled: false,
                    value: "close",
                    iconPosition: "center"
                }}
            ]);

            component.set("v.closedColumns", [
                {label: "Case Number", fieldName: "CaseNumber", type: "text"},
                {label: "Subject", fieldName: "Subject", type: "text"},
                {label: "Status", fieldName: "Status", type: "text"},
                {type: "button", typeAttributes: {
                    label: "View",
                    name: "View",
                    title: "View",
                    disabled: false,
                    value: "view",
                    iconPosition: "center"
                }}
            ]);
        }

        else if((userPosition === 'Service Agent')){
            component.set("v.UATruthy",false);
            component.set("v.mycolumns", [
                {label: "Case Number", fieldName: "CaseNumber", type: "text"},
                {label: "Subject", fieldName: "Subject", type: "text"},
                {label: "Status", fieldName: "Status", type: "text"},
                {label: "Priority", fieldName: "Priority", type: "text"},
                {type: "button", typeAttributes: {
                    label: "View",
                    name: "View",
                    title: "View",
                    disabled: false,
                    value: "view",
                    iconPosition: "center"
                }},
                {type: "button", typeAttributes: {
                    label: "Edit",
                    name: "Edit",
                    title: "Edit",
                    disabled: false,
                    value: "edit",
                    iconPosition: "middle"
                }},
                {type: "button", typeAttributes: {
                    label: "Close Ticket",
                    name: "Close",
                    disabled: false,
                    value: "close",
                    iconPosition: "center"
                }}
            ]);
            component.set("v.closedColumns", [
                {label: "Case Number", fieldName: "CaseNumber", type: "text"},
                {label: "Subject", fieldName: "Subject", type: "text"},
                {label: "Status", fieldName: "Status", type: "text"},
                {label: "Priority", fieldName: "Priority", type: "text"},
                {type: "button", typeAttributes: {
                    label: "View",
                    name: "View",
                    title: "View",
                    disabled: false,
                    value: "view",
                    iconPosition: "center"
                }}
            ]);
        }

        $A.enqueueAction(component.get("c.fetchCase"));

    },

    fetchCase : function(component, event, helper) {
        var userId = component.get("v.userId");
        var userPosition = component.get("v.userPosition");
        if(userPosition === 'End User'){
            var action = component.get("c.returnCase");
            action.setParams({
                "userId" : userId
            });
            action.setCallback(this, function(response){
                component.set("v.caseList", response.getReturnValue());
                var caseList = [];
                var openList = [];
                var closedList = [];
                caseList = response.getReturnValue();
                caseList.forEach(element => {
                    if(element.Status == 'Closed')
                        closedList.push(element);
                    else
                        openList.push(element);
                });
                component.set("v.openCaseList", openList);
                component.set("v.closedCaseList", closedList);
                component.set("v.caseList", openList);
            });
            $A.enqueueAction(action);
        }

        else if((userPosition === 'Service Agent')){
            var action = component.get("c.returnCaseForAgent");
            action.setParams({
                "userId" : userId
            });
            action.setCallback(this, function(response){
                component.set("v.caseList", response.getReturnValue());
                var caseList = [];
                var openList = [];
                var closedList = [];
                caseList = response.getReturnValue();
                caseList.forEach(element => {
                    if(element.Status == 'Closed')
                        closedList.push(element);
                    else
                        openList.push(element);
                });
                component.set("v.openCaseList", openList);
                component.set("v.closedCaseList", closedList);
                component.set("v.caseList", openList);
            });
            $A.enqueueAction(action);
        }
    },

    closeModel: function(component, event, helper) {
        component.set("v.UModalTruthy", false);
        component.set("v.AModalTruthy", false);
    },

    viewRecord : function(component, event, helper) {
        var recId = event.getParam("row").Id;
        var actionName = event.getParam("action").name;
        if ( actionName == "Edit" ) {
            var editRecordEvent = $A.get("e.force:editRecord");
            editRecordEvent.setParams({
                "recordId": recId
            });
            editRecordEvent.fire();
        }
        else if ( actionName == "View") {
    
            if(component.get("v.userPosition") === 'End User'){
                component.set("v.UModalTruthy", "True");
                component.set("v.MCaseNumDef",event.getParam("row").CaseNumber);
                component.set("v.MSubjectDef",event.getParam("row").Subject);
                component.set("v.MDescriptionDef",event.getParam("row").Description);
                component.set("v.MPriorityDef",event.getParam("row").Priority);
                component.set("v.MStatusDef",event.getParam("row").Status);
                component.set("v.MReasonDef",event.getParam("row").Reason);
                component.set("v.MTypeDef",event.getParam("row").Type);
            }
            else{
                component.set("v.AModalTruthy", "True");
                component.set("v.MCaseNumDef",event.getParam("row").CaseNumber);
                component.set("v.MSubjectDef",event.getParam("row").Subject);
                component.set("v.MDescriptionDef",event.getParam("row").Description);
                component.set("v.MPriorityDef",event.getParam("row").Priority);
                component.set("v.MStatusDef",event.getParam("row").Status);
                component.set("v.MReasonDef",event.getParam("row").Reason);
                component.set("v.MTypeDef",event.getParam("row").Type);
                component.set("v.LoginUserDef",event.getParam("row").Login__r.Name__c);
                
                component.set('v.mapMarkers', [
                    {
                        location: {
                            Street: event.getParam("row").Login_User_Street__c,
                            City: event.getParam("row").Login_User_City__c,
                            State: event.getParam("row").Login_User_State__c
                        },
                        title: event.getParam("row").Login__r.Name__c
                    }
                ]);
                component.set('v.zoomLevel', 16);
            }

        }
        else if ( actionName == "Close") {
            var action = component.get("c.statusUpdate");
            action.setParams({
                "caseId" : recId,
                "Position" : component.get("v.userPosition")
            });
            action.setCallback(this, function(response){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "message": "Ticket closed successfully!!",
                    "type": "success",
                    "duration": "3000"
                });
                toastEvent.fire();
                var res = response.getReturnValue();

            });

            $A.enqueueAction(action);
            $A.enqueueAction(component.get("c.fetchCase"));

        }
    },

    tabSelection : function(component, event, helper) {
        var selection = component.get("v.selectedTab");
        if(selection == 'openTab'){
            component.set("v.caseList",component.get("v.openCaseList"));
        }
        else{
            component.set("v.caseList",component.get("v.closedCaseList"));
        }
    },

    logoutAction : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:loginPage"
        });
        evt.fire();
    }


})