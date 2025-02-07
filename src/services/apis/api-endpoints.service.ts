export const ENDPOINTS = {
    auth: {
        login: "/api/auth/login",
        register: "/api/auth/register",
        logout: "/api/auth/logout",
    },
    users: {
        base: "/api/users",
        updateUserStatus: "/api/users/update-status",
        updateUserAdmin: "/api/users/update-admin"
    },
    curriculums: {
        base: "/api/curriculums",
        activeCurriculums: "/api/curriculums/active",
        updateCurriculumStatus: "/api/curriculums/update-status",
    },
    grades: {
        base: "/api/grades",
        activeGrades: "/api/grades/active",
        updateGradeStatus: "/api/grades/update-status",
    },
    units: {
        base: "/api/units",
        activeUnit: "/api/units/active",
        updateUnitStatus: "/api/units/update-status",
    },
    partsOfSpeech: {
        base: "/api/parts-of-speech",
        activePartsOfSpeech: "/api/parts-of-speech/active",
        updatePartsOfSpeechStatus: "/api/parts-of-speech/update-status",
    },
    vocabularies: {
        base: "/api/vocabularies",
        updateVocabularyStatus: "/api/vocabularies/update-status",
        addManyVocabulary: "/api/vocabularies/add-many"
    }
}