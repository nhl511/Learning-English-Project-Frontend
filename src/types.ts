import {LucideIcon} from "lucide-react";

export interface NavigationItem {
    title: string,
    path?: string,
}
export interface SideMenuItem extends NavigationItem{
    icon: LucideIcon;
    subMenuItems?: NavigationItem[]
}
export interface User {
    ID: string,
    EMAIL: string,
    PASSWORD: string,
    FIRST_NAME: string,
    LAST_NAME: string,
    ADMIN: boolean,
    ACTIVE: boolean,
    EMAIL_VERIFIED_AT: string,
}

export interface Curriculum {
    ID: string,
    NAME: string,
    ACTIVE: boolean,
}

export interface Grade {
    ID: string,
    GRADE_NUMBER: number,
    ACTIVE: boolean,
    CURRICULUM: Curriculum
}

export interface Unit {
    ID: string,
    UNIT_NUMBER: number,
    UNIT_NAME: string,
    GRADE: Grade
    ACTIVE: boolean,
}

export interface PartsOfSpeech {
    ID: string,
    NAME: string,
    ACTIVE: boolean,
}

export interface Vocabulary {
    ID: string,
    WORD: string,
    DEFINITION: string,
    TRANSCRIPTION: string,
    NOTES: string,
    ACTIVE: boolean,
    PARTS_OF_SPEECH: PartsOfSpeech,
    UNIT: Unit,
}

export interface DataList {
    users: User[],
    curriculums: Curriculum[],
    grades: Grade[],
    units: Unit[],
    partsOfSpeeches: PartsOfSpeech[]
    vocabularies: Vocabulary[]
}

export interface Data {
    user: User,
    curriculum: Curriculum,
    grade: Grade,
    unit: Unit,
    partsOfSpeech: PartsOfSpeech,
    vocabulary: Vocabulary,
}

export interface ResponseData {
    status: "success" | "error";
    code: number;
    message: string;
    accessToken?: string;
    data?: DataList | Data;
}

export interface Jwt {
    userId: string,
    isAdmin: boolean,
    exp: number
}

export interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    user: User | null;
    setUser: (user: User | null) => void;
    fetchUserData: () => Promise<void>;
}