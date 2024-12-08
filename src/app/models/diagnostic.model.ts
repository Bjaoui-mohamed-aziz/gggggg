// import { Dossier } from "./dossier.model";

import { Patient } from "./dossier.model";

export class Diagnostic {
    id?: number;
    diagnostic?: string;
    dateCreation?: Date = new Date();
    // dossierMedical?: Dossier;
    patient?: Patient;
    
}
