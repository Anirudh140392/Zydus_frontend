import React from "react";
import ErrorBoundary from "../../../common/erroBoundryComponent";
import AddRuleCreator from "../addRuleCreator";

const NewRuleModal = ({ showRuleModal, setShowRuleModal, getRulesData, operator }) => {
    return (
        <ErrorBoundary>
            <AddRuleCreator
                open={showRuleModal}
                setShowRuleModal={setShowRuleModal}
                onSave={() => getRulesData(true)}
                operator={operator}
                onClose={() => setShowRuleModal(false)}
            />
        </ErrorBoundary>
    );
};

export default NewRuleModal;

