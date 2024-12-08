import { Diagnostic } from "./diagnostic.model";

export class Patient {
    id?: number;
    nom?: string;
    prenom?: string;
    cin?: string;
    sex?: string;
    color?: string;
    telephone?: string;
    dateNaissance?: string;
    listDiagnostics?: Diagnostic[];

}

// export class Dossier {
//     id?: number;
//     dateCreation?: Date = new Date();
//     listDiagnostics?: Diagnostic[];
//     patient?: Patient;
// }

export class Rdv{
    id?: number;
    daterdv?: string;
    heurerdv?: string;
    note?: string;
    patient?: Patient;
    patient_id?: number;
}
