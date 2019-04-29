import {Component, Input, OnInit, AfterViewInit, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, Validators, FormControl, AbstractControl, ValidatorFn} from '@angular/forms';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import {ControlledTermService} from "../../services/controlled-terms.service";
import {Post} from "../../models/post";
import {InputTypeService} from "../../services/input-type.service";
import {InputType} from "../../models/input-type";

import {TemplateSchemaService} from "../../services/template-schema.service";
import {ControlledComponent} from "../controlled/controlled.component";
import {FileNode} from "../../models/file-node";


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.less'],
  providers: []
})
export class QuestionComponent implements OnInit, AfterViewInit {
  @Input() node: FileNode;
  @Input() parentGroup: FormGroup;
  @Input() disabled: boolean;
  @Output() changed = new EventEmitter<any>();

  formGroup: FormGroup;
  post: Post[];
  //post:any[];
  controlled: ControlledComponent;
  controlledGroup: FormGroup;
  copy:string="Copy";
  remove:string="Remove";



  _fb: FormBuilder;
  _ct: ControlledTermService;
  _yt;
  player;
  //private id: string = 'mw816POGRrk';


  constructor(fb: FormBuilder, ct: ControlledTermService,  yt: NgxYoutubePlayerModule) {
    this._fb = fb;
    this._ct = ct;
    this._yt = new NgxYoutubePlayerModule();
    this.player = this._yt.Player;
  }

  ngAfterViewInit() {
  }

  console(obj: any) {
    console.log('console', obj);
  }

  savePlayer(player) {
    this.player = player;
    console.log('player instance', player);
  }
  onStateChange(event) {
    console.log('player state', event.data);
  }

  ngOnInit() {
    this._ct.getPosts('NCIT').subscribe(posts => {
      this.post = posts;
      this._ct.postsData = posts;
    });
    // const results = {"page":1,"pageCount":2941,"pageSize":50,"prevPage":0,"nextPage":2,"collection":[{"id":"C129834","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C129834","@type":null,"type":"OntologyClass","prefLabel":"CALR NM_004343.3:c.1092_1143del52","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["A deletion of 52 nucleotides from the coding sequence of the CALR gene from positions 1092 through 1143."],"synonyms":["CALR NM_004343.3:c.1092_1143del52","Calreticulin Gene c.1092_1143del52","NM_004343.3:c.1092_1143del52","CRT c.1092_1143del52","CALR1","cC1qR c.1092_1143del52","Autoantigen Ro Gene c.1092_1143del52","Type 1 CALR Gene Variant","CALR c.1092_1143del52","RO c.1092_1143del52","CALR1 Gene Mutation","CALR Type 1 Gene Mutation"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C117457","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C117457","@type":null,"type":"OntologyClass","prefLabel":"Trial Sets Code","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["A character or string that represents the trial set."],"synonyms":["Trial Sets Code","SETCD"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C10277","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C10277","@type":null,"type":"OntologyClass","prefLabel":"Cytarabine/Thioguanine","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":[],"synonyms":["ARA-C/TG","TA","Cytarabine/Thioguanine"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C82956","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C82956","@type":null,"type":"OntologyClass","prefLabel":"Odontogenesis","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["The process of tooth development."],"synonyms":["Odontogenesis"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C114335","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C114335","@type":null,"type":"OntologyClass","prefLabel":"GNG12 wt Allele","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["Human GNG12 wild-type allele is located in the vicinity of 1p31.3 and is approximately 132 kb in length. This allele, which encodes guanine nucleotide-binding protein G(I)/G(S)/G(O) subunit gamma-12 protein, is involved in GTPase-dependent signaling."],"synonyms":["Guanine Nucleotide Binding Protein (G Protein), Gamma 12 wt Allele","GNG12 wt Allele","Guanine Nucleotide-Binding Protein, Gamma-12 Gene","RP5-975D15.2"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C14420","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C14420","@type":null,"type":"OntologyClass","prefLabel":"Mouse Strains","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["Breeds of mice utilized for biological research."],"synonyms":["Mouse Strains"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C42240","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C42240","@type":null,"type":"OntologyClass","prefLabel":"4: 120600921-120596009","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["Physical location of FABP2_Gene"],"synonyms":["4: 120600921-120596009"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C145889","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C145889","@type":null,"type":"OntologyClass","prefLabel":"Grade 4 Hepatic Failure, CTCAE","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["Life-threatening consequences; moderate to severe encephalopathy; coma"],"synonyms":["Grade 4 Hepatic Failure, CTCAE","Grade 4 Hepatic failure"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C144550","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C144550","@type":null,"type":"OntologyClass","prefLabel":"Grade 2 Body Odor, CTCAE","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["Pronounced odor; psychosocial impact; patient seeks medical intervention"],"synonyms":["Grade 2 Body Odor, CTCAE","Grade 2 Body odor"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C41144","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C41144","@type":null,"type":"OntologyClass","prefLabel":"Texture","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["A measure of the variation of the intensity of a surface, quantifying properties such as smoothness, coarseness, regularity, and resiliency. The term is often used as a descriptor for the structure or organization of a tissue or organ. The three principal approaches used to describe texture are statistical, structural and spectral."],"synonyms":["Texture"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C136077","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C136077","@type":null,"type":"OntologyClass","prefLabel":"PODCI Adolescent Parent-Reported Version - Participate in Pickup Games","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["Pediatric Outcomes Data Collection Instrument, Adolescent Parent-Reported Version (PODCI Adolescent Parent-Reported Version) Can your child participate in pickup games or sports with other children the same age (For example: tag, dodge ball, basketball, softball, soccer, catch, jump rope, touch football, hop scotch)?"],"synonyms":["PODCI244","PODCI Adolescent Parent-Reported Version - Participate in Pickup Games","PODCI2-Participate in Pickup Games"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C69005","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C69005","@type":null,"type":"OntologyClass","prefLabel":"Pladienolide Derivative E7107","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["A synthetic urethane derivative of pladienolide D with potential antineoplastic activity. Pladienolide derivative E7107 is generated from the 12-membered macrolide pladienolide D, one of several macrolides derived from the bacterium Streptomyces platensis Mer-11107. This agent appears to bind to the 130-kDa subunit 3 (spliceosome-associated protein 130; SAP130) of the splicing factor 3b (SF3b), resulting in inhibition of pre-messenger RNA splicing and the arrest of cell-cycle progression. The splicing factor SF3b is a multiprotein complex integral to the accurate excision of introns from pre-messenger RNA; the subunit SAP130 associates with U2 snRNP and is recruited to prespliceosomal complexes."],"synonyms":["E7107","Pladienolide Derivative E7107"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C135387","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C135387","@type":null,"type":"OntologyClass","prefLabel":"Lead Site aVF-Ventral","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["An augmented unipolar electrocardiogram limb lead in which the positive electrode is situated at the hindquarters proximal to the sacrum and the negative electrode is a combination of the electrode behind the right ear near the right mastoid process and the electrode near the apex of the heart (located in the ICS of left 5-6 rib close to the sternum). (CDISC)"],"synonyms":["Lead Site aVF-Ventral","LEAD aVF-VENTRAL"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C16965","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C16965","@type":null,"type":"OntologyClass","prefLabel":"Peptidase","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["Enzymes acting on peptide bonds. EC 3.4.-"],"synonyms":["Peptide Hydrolase","Proteolytic Enzyme","Protease","Proteases","Peptidase","Proteinase"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C77504","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C77504","@type":null,"type":"OntologyClass","prefLabel":"Sodium Trimetaphosphate","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":[],"synonyms":["Sodium Trimetaphosphate","SODIUM TRIMETAPHOSPHATE"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C132265","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C132265","@type":null,"type":"OntologyClass","prefLabel":"Percent Change From Nadir in Sum of Products of Perpendicular Diameters","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["The most recently recorded sum of products of perpendicular diameters minus the lowest sum of diameters previously recorded divided by the lowest sum of products of perpendicular diameters previously recorded, multiplied by 100."],"synonyms":["Percent Change From Nadir in Sum of Area","PCNSPPD","Percent Change From Nadir in Sum of Products of Perpendicular Diameters","Percent Change Nadir in Sum of PPD"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C68910","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C68910","@type":null,"type":"OntologyClass","prefLabel":"Coulomb per Cubic Meter","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["A unit of volumetric electrical charge density designated as the charge equal to one coulomb distributed over the volume equal to one cubic meter."],"synonyms":["Coulomb per Cubic Meter","C/m3"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C61756","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C61756","@type":null,"type":"OntologyClass","prefLabel":"Monoethanolamine","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["A first generation monoethanolamine with antihistaminic property. Ethanolamine competes with free histamine for binding at the histamine (H)-1 receptor thereby acting as an inverse agonist that combines with and stabilizes the inactive form of the H1-receptor thereby shifting the equilibrium toward the inactive state. This leads to a reduction of the negative symptoms brought on by H1-receptor binding."],"synonyms":["Ethanolamine","beta-Aminoethyl Alcohol","MONOETHANOLAMINE","2-Amino-1-ethanol","Monoethanolamine","1-Amino-2-hydroxyethane","Colamine","beta-Hydroxyethylamine","Olamine","Thiofaco M-50"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C74457","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C74457","@type":null,"type":"OntologyClass","prefLabel":"CDISC SDTM Race Terminology","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["Terminology codelist used to identify the race of an individual within the Clinical Data Interchange Standards Consortium Study Data Tabulation Model."],"synonyms":["RACE","Race","CDISC SDTM Race Terminology","SDTM-RACE"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C41022","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C41022","@type":null,"type":"OntologyClass","prefLabel":"Neoplastic Plasma Cells Present in Bone Marrow","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":[],"synonyms":["Neoplastic Plasma Cells Present in Bone Marrow"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C18939","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C18939","@type":null,"type":"OntologyClass","prefLabel":"Photometry/Spectrum Analysis, X-ray/Neutron","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":[],"synonyms":["Photometry/Spectrum Analysis, X-ray/Neutron"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C62852","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C62852","@type":null,"type":"OntologyClass","prefLabel":"Reset Issue","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["Problem associated with setting a variable, register, or other storage location back to a prescribed state."],"synonyms":["Reset Issue","Reset Problem"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C115752","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C115752","@type":null,"type":"OntologyClass","prefLabel":"Clinical Trial Medical Monitoring Plan","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["A proposed method to ensure the implementation of medical surveillance of subjects during a clinical trial."],"synonyms":["Med Mon Plan","Clinical Trial Medical Monitoring Plan","Medical Monitoring Plan"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C145862","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C145862","@type":null,"type":"OntologyClass","prefLabel":"Grade 4 Gallbladder Infection, CTCAE","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["Life-threatening consequences; urgent intervention indicated"],"synonyms":["Grade 4 Gallbladder Infection, CTCAE","Grade 4 Gallbladder infection"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C13324","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C13324","@type":null,"type":"OntologyClass","prefLabel":"Hematopoietic","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["Pertaining to or related to the formation of blood cells."],"synonyms":["Hematopoietic"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C3606","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C3606","@type":null,"type":"OntologyClass","prefLabel":"Spermatic Cord Lipoma","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["A benign adipose tissue neoplasm of the spermatic cord. This is the most common tumor amongst the benign paratesticular lesions."],"synonyms":["Spermatic Cord Lipoma","Lipoma of Spermatic Cord","Lipoma of the Spermatic Cord"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C44033","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C44033","@type":null,"type":"OntologyClass","prefLabel":"Miami","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":[],"synonyms":["Miami"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C6390","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C6390","@type":null,"type":"OntologyClass","prefLabel":"Gestational Trophoblastic Tumor by FIGO Stage","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":[],"synonyms":["Gestational Trophoblastic Tumor by FIGO Stage"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C146347","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C146347","@type":null,"type":"OntologyClass","prefLabel":"Grade 5 Hyperkalemia, CTCAE","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["Death"],"synonyms":["Grade 5 Hyperkalemia, CTCAE","Grade 5 Hyperkalemia"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C78600","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C78600","@type":null,"type":"OntologyClass","prefLabel":"Salivary Duct Inflammation","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["An inflammatory process affecting the salivary duct."],"synonyms":["Salivary duct inflammation","Salivary Duct Inflammation"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C7904","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C7904","@type":null,"type":"OntologyClass","prefLabel":"Invasive Malignant Thymoma","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["A malignant thymoma that extends beyond the capsule and infiltrates the surrounding tissues."],"synonyms":["Malignant Thymoma, Invasive","Thymoma Malignant Invasive","Invasive Malignant Thymoma"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C133577","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C133577","@type":null,"type":"OntologyClass","prefLabel":"Pathologic Stage IIIA Gastroesophageal Junction Adenocarcinoma AJCC v8","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["Stage IIIA includes: (T1, N2, M0, Any G); (T2, N1, M0, Any G). T1: Tumor invades the lamina propria, muscularis mucosae, or submucosa. T2: Tumor invades the muscularis propria. N1: Tumor with metastasis in one or two regional lymph nodes. N2: Tumor with metastasis in three to six regional lymph nodes. M0: No distant metastasis. (AJCC 8th ed.)"],"synonyms":["Pathologic Stage IIIA Gastroesophageal Junction Adenocarcinoma AJCC v8"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C77323","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C77323","@type":null,"type":"OntologyClass","prefLabel":"Clormecaine","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":[],"synonyms":["2-(Dimethylamino)ethyl 3-amino-4-chlorobenzoate Ester","Clormecaine","CLORMECAINE"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C17992","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C17992","@type":null,"type":"OntologyClass","prefLabel":"Cell Biology","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["The study of the internal workings of cells at the microscopic and molecular level."],"synonyms":["Cellular Biology","Cell Biology"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C22748","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C22748","@type":null,"type":"OntologyClass","prefLabel":"Serous Adenofibroma of the Mouse Ovary; Benign Serous Cystadenofibroma of the Mouse Ovary","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":[],"synonyms":["Serous Adenofibroma of the Ovary; Benign Serous Cystadenofibroma of the Ovary","Serous Adenofibroma of the Mouse Ovary; Benign Serous Cystadenofibroma of the Mouse Ovary"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C125917","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C125917","@type":null,"type":"OntologyClass","prefLabel":"Feel Urge to Move Bowels Quickly","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["A question about whether an individual feels or felt the urge to move their bowels quickly."],"synonyms":["Feel Urge to Move Bowels Quickly","Did you feel the urge to move your bowels quickly"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C130158","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C130158","@type":null,"type":"OntologyClass","prefLabel":"Chemokine (C-C Motif) Ligand 7 Measurement","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["The determination of the amount of chemokine (C-C Motif) ligand 7 present in a sample."],"synonyms":["Chemokine (C-C Motif) Ligand 7 Measurement","Chemokine (C-C Motif) Ligand 7","MCP3","CCL7","Monocyte Chemotactic Protein 3","CCL7 Measurement"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C81313","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C81313","@type":null,"type":"OntologyClass","prefLabel":"Neurologic Examination","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["The assessment of the functionality of the brain, spinal column, and nerves."],"synonyms":["Neurologic Examination","Neurological Examination","neurological exam"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C16896","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C16896","@type":null,"type":"OntologyClass","prefLabel":"Nauru","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["A country in Oceania, occupying an island in the South Pacific Ocean, south of the Marshall Islands."],"synonyms":["520","Nauru","NRU","NAURU","NR"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C154296","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C154296","@type":null,"type":"OntologyClass","prefLabel":"Dapagliflozin Propanediol","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":[],"synonyms":["Dapagliflozin Propanediol","Dapagliflozin S-propylene Glycol Monohydrate","D-Glucitol, 1,5-Anhydro-1-C-(4-chloro-3-((4-ethoxyphenyl)methyl)phenyl)-, (1S)-, Compd. with (2S)-1,2-propanediol, Hydrate (1:1:1)","DAPAGLIFLOZIN PROPANEDIOL","Dapagliflozin Propylene Glycol Hydrate"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C147659","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C147659","@type":null,"type":"OntologyClass","prefLabel":"FACIT-Dyspnea 10 Item Short Form - Part I: Carry 10-20 Lbs","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["Functional Assessment of Chronic Illness Therapy-Dyspnea 10 Item Short Form (FACIT-Dyspnea 10 Item Short Form) Part I. Over the past 7 days, how short of breath did you get with each of these activities?: Carrying something weighing 10-20 lbs (about 4.5-9kg, like a large bag of groceries) from one room to another."],"synonyms":["FAC084-Part I: Carry 10-20 Lbs","FAC08417","FACIT-Dyspnea 10 Item Short Form - Part I: Carry 10-20 Lbs"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C87013","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C87013","@type":null,"type":"OntologyClass","prefLabel":"Noise Artifact","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["An artifact that appears as a point to point signal fluctuation in a uniform material."],"synonyms":["Noise Artifact"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C54711","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C54711","@type":null,"type":"OntologyClass","prefLabel":"Atmosphere","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["Non-SI unit of pressure equal to 101 325 Pa."],"synonyms":["Atmosphere","atmos","atmosphere (standard)","atm","Standard Atmosphere"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C3669","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C3669","@type":null,"type":"OntologyClass","prefLabel":"Malnutrition","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["Inadequate nutrition resulting from poor diet, malabsorption, or abnormal nutrient distribution."],"synonyms":["malnutrition","Malnutrition","malnourished"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C73239","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C73239","@type":null,"type":"OntologyClass","prefLabel":"Pumitepa","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["A thiotepa derivative with potential antineoplastic alkylating activity. Although the exact mechanism of action of pumitepa has yet to be fully elucidated, this agent appears to work through alkylation, thereby causing DNA damage and cell cycle arrest."],"synonyms":["Fopurin","Pumitepa","PUMITEPA"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C95512","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C95512","@type":null,"type":"OntologyClass","prefLabel":"Pancreatic Intraductal Papillary Mucinous Neoplasm, Pancreatobiliary-Type","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["A pancreatic intraductal papillary mucinous neoplasm characterized by the presence of neoplastic epithelial cells that form thin-branching papillae and exhibit high grade dysplasia."],"synonyms":["Pancreatic Intraductal Papillary Mucinous Neoplasm, Pancreatobiliary-Type"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C110523","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C110523","@type":null,"type":"OntologyClass","prefLabel":"Campbell County, VA","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":[],"synonyms":["VA031","Campbell County, Virginia","Campbell County, VA","Campbell County"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C11281","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C11281","@type":null,"type":"OntologyClass","prefLabel":"Fluorouracil/Hydroxyurea/Paclitaxel","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":[],"synonyms":["5-FU/HU/TAX","Fluorouracil/Hydroxyurea/Paclitaxel"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C63549","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C63549","@type":null,"type":"OntologyClass","prefLabel":"University of California at Santa Cruz","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":["A campus of the University of California located in Santa Cruz, CA."],"synonyms":["UCSC","University of California at Santa Cruz","UC Santa Cruz"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false},{"id":"C38138","@id":"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C38138","@type":null,"type":"OntologyClass","prefLabel":"Ferrosoferric Oxide","creator":null,"ontology":"http://data.bioontology.org/ontologies/NCIT","definitions":[],"synonyms":["C.I. 77499","Magnetic Black","Magnetite","Iron Black","Black Iron Oxide","EPT 500","Triiron Tetraoxide","FERROSOFERRIC OXIDE","Ferrosoferric Oxide","Iron (II, III) Oxide"],"subclassOf":null,"relations":null,"provisional":false,"created":null,"hasChildren":false}]};
    // this.post = results.collection;


    // build the array of controls and add it to the parent
    const validators = this.getValidators(this.node);
    const arr = [];
    switch (this.node.type) {

      case InputType.youTube:
      case InputType.image:
      case InputType.sectionBreak:
      case InputType.pageBreak:
      case InputType.richText:
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.controlled:
        this.controlledGroup = this._fb.group({
          chips: this._fb.array(this.node.label),
          ids: this._fb.array(this.node.value),
          search: new FormControl({disabled: this.disabled})
        });
        arr.push(this.controlledGroup);
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.date:
        this.node.value.forEach((value, i) => {
          const control = new FormControl({value: new Date(value), disabled: this.disabled}, validators);
          arr.push(control);
        });
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.textfield:
      case InputType.textarea:
        this.node.value.forEach((value, i) => {
          const control = new FormControl({value: value, disabled: this.disabled}, validators);
          arr.push(control);
        });
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.list:
        this.node.value.forEach((value, i) => {
          const control = new FormControl({value: value, disabled: this.disabled}, validators);
          arr.push(control);
        });
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.attributeValue:
        this.node.value.forEach((value, i) => {
          const items = [];
          const controlValue = new FormControl({value: value['rdfs:label'], disabled: this.disabled}, validators);
          items.push(controlValue);
          const controlLabel = new FormControl({value: value['@value'], disabled: this.disabled}, validators);
          items.push(controlLabel);
          const fg = this._fb.group({values: this._fb.array(items)});
          arr.push(fg);
        });
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.radio:
        this.node.value.forEach((item, index) => {
          const obj = {};
          obj[this.node.key + index] = this.node.value[index];
          const control = new FormControl({value: this.node.value[index], disabled: this.disabled});
          arr.push(control);
        });
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.checkbox:
        console.log('checkbox', this.node.value, this.node.model[this.node.key]);
        this.node.value.forEach((item, index) => {
          const obj = {};
          obj[this.node.key + index] = this.node.value[index];
          let control = new FormControl({value: this.node.value[index], disabled: this.disabled});
          arr.push(control);
        });
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;
    }
  }

  // controlled term was selected
   onSelectedControlled(event) {
    TemplateSchemaService.addControlledValue(this.node.model, this.node.key, event.id, event.title);
  }

  // controlled term was removed
   onRemovedControlled(index) {
    TemplateSchemaService.removeControlledValue(this.node.model, this.node.key, index);
  }

  allowsMultiple(type: InputType) {
    return InputTypeService.allowsMultiple(type);
  }

  getValidators(node: FileNode) {
    const validators = [];
    if (node.required) {
      validators.push(Validators.required);
    }
    if (node.subtype === InputType.email) {
      validators.push(Validators.email);
    }
    if (node.min !== null) {
      validators.push(Validators.min(node.min));
    }
    if (node.max !== null) {
      validators.push(Validators.max(node.max));
    }
    if (node.subtype == InputType.numeric) {
      validators.push(this.numericValidator());
    }
    if (node.decimals) {
      validators.push(this.decimalValidator(node.decimals));
    }
    if (node.minLength !== null) {
      validators.push(Validators.minLength(node.minLength));
    }
    if (node.maxLength !== null) {
      validators.push(Validators.maxLength(node.maxLength));
    }
    if (node.pattern !== null) {
      validators.push(Validators.pattern(node.pattern));
    }
    if (node.subtype === InputType.link) {
      // validators.push(this.validateUrl);
      validators.push(this.urlValidator);
    }
    return validators;
  }

  // validator for min and max
  quantityRangeValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && (isNaN(control.value) || control.value < min || control.value > max)) {
        return {'quantityRange': true};
      }
      return null;
    };
  }

  // validator for URLs
  numericValidator(): any {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      let result = null;
      if (control.value) {
        if (isNaN(Number(control.value))) {
          result = {'numeric': true};
        }
      }
      return result;
    };
  }

  // validator for precision of a number
  decimalValidator(precision: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: { actual: number, required: number } } | null => {
      let result = null;
      if (control.value && (!isNaN(Number(control.value)))) {
        const actual = control.value.split(".")[1].length;
        if (precision !== actual) {
          result = {
            decimal: {
              actual: actual,
              required: precision
            }
          };
        }
      }
      return result;
    };
  }

  // validator for URLs
  urlValidator(url: FormControl): any {
    if (url.pristine) {
      return null;
    }
    const URL_REGEXP = /^(http?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    url.markAsTouched();
    if (URL_REGEXP.test(url.value)) {
      return null;
    }
    return {
      url: true
    };
  }

  get isValid() {
    let result = false;

    if (this.parentGroup && this.parentGroup.controls.hasOwnProperty(this.node.key)) {
      result = this.parentGroup.controls[this.node.key].valid;
    }
    console.log('isValid', result)
    return result;
  }

  onChanges(node: FileNode, index: number, value: any) {
    this.changed.emit({'type': node.type, 'subtype': node.subtype,'model':node.model,'key':node.key, 'index':index,'location': node.valueLocation, 'value':value});
  }

  isChecked(node, index, label) {
    return node.value[index].indexOf(label) !== -1;
  }

  toggleChecked(node, index,label) {
    if (this.isChecked(node, index,label)) {
      node.value[index].splice(node.value[index].indexOf(label), 1);
    } else {
      node.value[index].push(label);
    }
  };

  onAVLabelChanges(node: FileNode, index: number, valueLocation: string, value: any) {
    this.changed.emit({'type': 'attribute-value', 'subtype': '','model':node.model,'key':node.key, 'index':index,'location': valueLocation, 'value':value});
 }

  onAVValueChanges(node: FileNode, index: number, valueLocation: string, value: any) {
    this.changed.emit({'type': 'textfield', 'subtype': '','model':node.model,'key':node.model[node.key][index], 'index':index,'location': '@value', 'value':value});
  }

  buildAttributeValueControls(val: any[], formGroup: FormGroup) {
    const arr = [];
    val.forEach((value, i) => {
      const items = [];
      const controlValue = new FormControl({value: value['rdfs:label'], disabled: this.disabled});
      items.push(controlValue);
      const controlLabel = new FormControl({value: value['@value'], disabled: this.disabled});
      items.push(controlLabel);
      const fg = this._fb.group({values: this._fb.array(items)});
      arr.push(fg);
    });
    this.formGroup = this._fb.group({values: this._fb.array(arr)});
    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  copyAttributeValue(node: FileNode, index: number) {
    TemplateSchemaService.copyAttributeValue(node.model, node.key, index);
    const val = TemplateSchemaService.buildAttributeValues(node.model, node.key);
    this.buildAttributeValueControls(val, this.formGroup);
  }

  removeAttributeValue(node: FileNode, index: number) {
    TemplateSchemaService.removeAttributeValue(node.model, node.key, index);
    const val = TemplateSchemaService.buildAttributeValues(node.model, node.key);
    this.buildAttributeValueControls(val, this.formGroup);
  }

  // do you want to filter dates out of the calendar?
  dateFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  addNewItem() {

    const value = '';
    this.node.value.push(value);
    const control = new FormControl(value, this.getValidators(this.node));
    const fa = this.formGroup.controls.values as FormArray;
    fa.push(control);

    let obj = {};
    obj[this.node.valueLocation] = '';
    this.node.model[this.node.key].push(obj);

    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  deleteLastItem() {
    const at = this.node.value.length - 1;
    this.node.value.splice(at, 1);
    const fa = this.formGroup.controls.values as FormArray;
    fa.removeAt(fa.length - 1);
    this.node.model[this.node.key].splice(at, 1);
    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  loadForm(key, form) {
    console.log('load the form with key', key, form);
  }

  getImageWidth(node:FileNode) {
    let width = 367;
    if (node.size && node.size.width && Number.isInteger(node.size.width)) {
       width=node.size.width;
    }
    return width;
  }

  getImageHeight(node:FileNode) {
    let height = 270;
    if (node.size && node.size.height && Number.isInteger(node.size.height)) {
      height=node.size.height;
    }
    return height;
  }

  getYouTubeEmbedFrame(node:FileNode) {
    var width = 560;
    var height = 315;
    var content:string = node.value[0];
    if (content) {
      content = content.replace(/<(?:.|\n)*?>/gm, '');
    }

    //var size = dms.getSize(field);
    let size;

    if (size && size.width && Number.isInteger(size.width)) {
      width = size.width;
    }
    if (size && size.height && Number.isInteger(size.height)) {
      height = size.height;
    }

    // if I say trust as html, then better make sure it is safe first
    if (content) {
      return
        '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + content + '" frameborder="0" allowfullscreen></iframe>';
    }
  };


}


