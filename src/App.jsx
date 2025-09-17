import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './assets/composant/login';
import MotDePasseOublie from './assets/composant/mot_passe_oublier';
import NouveauMotDePasse from './assets/composant/nouveau_mot';
import UtilisateurPage from './assets/Pages/AQpage/utilisateurPages';
import ProtectedRoute from '../ProtectedRoute';
import DashboardAQ from './assets/composant/LayoutAQ/utilisateurLayout';
import HistoriqueConnexions from './assets/composant/AQ/historiqueAq';
import ProduitPage from './assets/Pages/AQpage/produitPage';
import FabricationPage from './assets/Pages/AQpage/fabricationPage';
import AtelierManager from './assets/composant/AQ/Atelier';
import EtapePage from './assets/Pages/AQpage/etapePage';
import Etape1Page from './assets/Pages/AQpage/etape1Page';
import SousetapePage from './assets/Pages/AQpage/sousetapePage';
import DocumentPage from './assets/Pages/AQpage/documentPage';
import MbrPage from './assets/Pages/AQpage/mbrPage';
import EchantillonPage from './assets/Pages/AQpage/echantillonPage';
import HomePage from './assets/Pages/AQpage/homePage';
import NavbarComponent from './assets/composant/production/navbar';
import NavbarLayout from './assets/composant/LayoutAQ/productionLayout';
import PetitEPage from './assets/Pages/AQpage/petite_etapePage';
import MBR1Page from './assets/Pages/AQpage/fabricationBRPage';
import AppareilPage from './assets/Pages/AQpage/appareilPage';
import AtelierBRPage from './assets/Pages/AQpage/atelierMbrPage';
import Fab_echanPage from './assets/Pages/AQpage/liste_fab_echanPage';
import ModeleechanPage from './assets/Pages/AQpage/modele_echanPage';
import Copie_echanPage from './assets/Pages/AQpage/copie_echanPage';
import MethodePage from './assets/Pages/AQpage/methodePage';
import MethFabriPage from './assets/Pages/AQpage/FabrimetPage';
import UtilisateurprodPage from './assets/Pages/PRODpage/utilisateurprodPage';
import HistoriqueprodPage from './assets/Pages/PRODpage/historiqueprodPage';
import ProductionPage from './assets/Pages/PRODpage/productionPage';
import MBRProdPage from './assets/Pages/PRODpage/mbrprodpage';
import ProduitprodPage from './assets/Pages/PRODpage/produitPage';
import AttenteBRPage from './assets/Pages/PRODpage/attenteBRPage';
import MatierePage from './assets/Pages/AQpage/matierePage';
import FabmatierePage from './assets/Pages/AQpage/listefabmatierePage';
import ColonneMATPage from './assets/Pages/AQpage/colonnematierePage';
import DetailattentePage from './assets/composant/production/detailattenteBrPage';
import EchantillonaffichePage from './assets/Pages/PRODpage/MBRpage/AffichagePage/echantilonaffichePage';
import MatiereaffichePage from './assets/Pages/PRODpage/MBRpage/AffichagePage/matiereaffichePage';
import TableaumatierePage from './assets/Pages/PRODpage/MBRpage/AffichagePage/tableaumatierePage';
import EtapebymbrPage from './assets/Pages/PRODpage/MBRpage/AffichagePage/etapeaffichePage';
import PetitetapeBrPage from './assets/Pages/PRODpage/MBRpage/AffichagePage/petitetapeaffichePage';
import ValeuretapeBrPage from './assets/Pages/PRODpage/MBRpage/AffichagePage/valeuretapebrPage';
import EncoursBRPage from './assets/Pages/PRODpage/MBRpage/encoursBRPage';
import DetailencoursPage from './assets/Pages/PRODpage/detailsencoursBrPage';
import MatiereactionPage from './assets/Pages/PRODpage/MBRpage/Actionpage/matiereactionPage';
import TableaumatiereactionPage from './assets/Pages/PRODpage/MBRpage/Actionpage/tableaumatiereActionPage';
import EchantillonactionPage from './assets/Pages/PRODpage/MBRpage/Actionpage/echantillonActionPage';
import EtapebymbractionPage from './assets/Pages/PRODpage/MBRpage/Actionpage/etapeActionPage';
import PetitetapembrActionPage from './assets/Pages/PRODpage/MBRpage/Actionpage/petiteetapeactionPage';
import ValeuretapeactionBrPage from './assets/Pages/PRODpage/MBRpage/Actionpage/valeuretapeActionPage';
import ListedocumentPage from './assets/Pages/PRODpage/MBRpage/Actionpage/liste_docPage';
import CampagnePage from './assets/Pages/PRODpage/campagnePage';
import CampagneCardPage from './assets/Pages/AQpage/campagneAqPage';
import DetailPage from './assets/Pages/AQpage/detailsBrPage';
import CampagneEmiPage from './assets/Pages/PRODpage/campagneEmissionPage';
import CampagneprodPage from './assets/Pages/PRODpage/CampagneProdPage';
import TerminerBrPage from './assets/Pages/PRODpage/terminerBrPage';
import CampagneHomePage from './assets/Pages/AQpage/campagne/campagneHome';
import CampagneBRPage from './assets/composant/AQ/campagne/campagneBrPage';
import CampagneterminerPage from './assets/Pages/AQpage/campagne/campagneTerminerPage';
import DemandeBrPage from './assets/Pages/PRODpage/demandeBrPage';
import NotificationPage from './assets/Pages/AQpage/notificationAqPage';
import DocumentCampPage from './assets/Pages/AQpage/campagne/documentcampPage';
import ArchivePage from './assets/Pages/AQpage/Archive/archivePage';
import AtelierEtapePage from './assets/Pages/AQpage/Archive/atelieretapePage';
import EncourbrAQPage from './assets/composant/AQ/MBRAction/mbrEncours/mbrEncoursPage';
import NavigationAQBRPage from './assets/Pages/AffichebrAq/detailsEncoursPage';
import PetiteEtapeAQBRPage from './assets/Pages/AffichebrAq/petiteetapePage';
import EtapeAQBRPage from './assets/Pages/AffichebrAq/etapePage';
import MatiereAQBRPage from './assets/Pages/AffichebrAq/matiereAQPage';
import EchantillonAQBRPage from './assets/Pages/AffichebrAq/echantillonAqPage';
import OuvrierLayout from './assets/composant/LayoutAQ/ouvrierLayout';
import CampagneOuvrierPage from './assets/Pages/Ouvrier/campagneOuvrierPage';
import MbrOuvrierPage from './assets/Pages/Ouvrier/mbrOuvrierPage';
import DetailsOuvrierPage from './assets/Pages/Ouvrier/detailsOuvrierPage';
import MatiereOuvrierPage from './assets/Pages/Ouvrier/matiereOuvrierPage';
import EtapeOuvriePage from './assets/Pages/Ouvrier/etapeOuvrierPage';
import PetiteEtapeOuvrierPage from './assets/Pages/Ouvrier/petitetapeOuvrierPage';
import ListeEchantillonsOuvrierPage from './assets/Pages/Ouvrier/ListeEchantillonsOuvrierPage';
import ProduitsCampagneEnCoursPage from './assets/Pages/AQpage/campagne/campagneProduitPage';
import ProduitsCampagneEnCoursProdPage from './assets/Pages/PRODpage/prodcampagneProduitPage';
import ProduitsCampagneEnCoursOuvrierPage from './assets/Pages/Ouvrier/ProduitsCampagneEnCoursOuvrierPage';



function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
        <Route path="/nouveau_mot_de_passe" element={<NouveauMotDePasse />} />

        {/* Routes protégées pour AQ */}
        <Route path="/AQ" element={<ProtectedRoute><DashboardAQ /></ProtectedRoute>}>
          <Route path="home" element={<HomePage/>} />
          <Route path="utilisateur" element={<UtilisateurPage />} />
           <Route path="historique" element={<HistoriqueConnexions />} />
           <Route path="produit" element={<ProduitPage/>} />
           <Route path="fabrication/:id_pro" element={<FabricationPage />} />
           <Route path="atelier" element={<AtelierManager />} />
           <Route path="etape" element={<EtapePage />} />
           <Route path="etape1/:code_fab/:id_atelier" element={<Etape1Page />} /> 
           <Route path="sousetape/:id_atelier/:id_eta" element={<PetitEPage />} />  
           <Route path="document" element={<DocumentPage />} />
           <Route path="mbr/:code_fab/:id_camp" element={<AtelierBRPage/>} />
           <Route path="creer-mbr/:code_fab/:id_atelier/:id_camp" element={<MbrPage/>}/>
            <Route path="echantillon/:id_mbr/:code_fab" element={<Copie_echanPage/>} />
            <Route path="ajout-parametre/:id_atelier/:id_eta/:id_peta" element={<SousetapePage/>}/>
            <Route path="mbr1" element={<MBR1Page />} />
            <Route path="appareil/:id_atelier" element={<AppareilPage />} />

            <Route path="Mechant" element={<Fab_echanPage />} />
            <Route path="echan/:code_fab" element={<ModeleechanPage />} />

            {/* Route pour la méthode */}
            <Route path="methode/:code_fab" element={<MethodePage />} />
            <Route path="methodefab" element={<MethFabriPage />} />
            <Route path="matiere/:code_fab" element={<MatierePage />} />
            <Route path="fabmatiere" element={<FabmatierePage />} />
            <Route path="colonnematiere/:id_mat" element={<ColonneMATPage />} />

            <Route path="campagneAQ" element={<CampagneCardPage />} />
            <Route path="detailmbr/:id_mbr/:code_fab" element={<DetailPage />} />

            <Route path="campagneHome" element={<CampagneHomePage />} />
            <Route path="campagneBR/encours/:id_pro" element={<CampagneBRPage />} />
            <Route path="campagneBR/terminer" element={<CampagneterminerPage />} />
            <Route path="notification" element={<NotificationPage />} />
            <Route path="documentCamp/:code_fab/:id_camp" element={<DocumentCampPage />} />

            <Route path="archive" element={<ArchivePage />} />
            <Route path="atelieretape/:code_fab" element={<AtelierEtapePage />} />

            <Route path="encoursAQ/:code_fab/:id_camp" element={<EncourbrAQPage />} />
            <Route path="detailencoursAQ/:id_mbr/:code_fab/:id_camp" element={<NavigationAQBRPage />} />
            <Route path="etapeAQ/:id_mbr/:code_fab" element={<EtapeAQBRPage />} />
            <Route path="petiteetapeAQ/:id_mbr/:id_eta" element={<PetiteEtapeAQBRPage />} />
            <Route path="matiereAQ/:id_mbr/:code_fab" element={<MatiereAQBRPage />} />
            <Route path="echantillonAQ/:id_mbr/:code_fab" element={<EchantillonAQBRPage />} />
            <Route path="campagneProduit" element={<ProduitsCampagneEnCoursPage />} />


          {/* ajoute d'autres sous-routes ici */}
        </Route>
        
        {/* Routes protégées pour PROD */}
        <Route path="/PROD" element={<ProtectedRoute><NavbarLayout /></ProtectedRoute> }>
         <Route path="home" element={<HomePage/>} />
         <Route path="utilisateurProd" element={<UtilisateurprodPage />} />
        <Route path="historiqueProd" element={<HistoriqueprodPage />} />
        <Route path="production/:id_pro" element={<ProductionPage />} />
        <Route path="mbr/:code_fab/:id_camp" element={<MBRProdPage />} />
        <Route path="produit" element={<ProduitprodPage />} />
        <Route path="attente/:code_fab/:id_camp" element={<AttenteBRPage />} />
        <Route path="detailattente/:id_mbr/:code_fab/:id_camp" element={<DetailattentePage />} />
        <Route path="echantillonaffiche/:id_mbr/:code_fab" element={<EchantillonaffichePage />} />
        <Route path="matiereaffiche/:id_mbr/:code_fab" element={<MatiereaffichePage />} />
        <Route path="tableaumatiere/:id_mbr/:id_mat" element={<TableaumatierePage />} />
        <Route path="etapeaffiche/:id_mbr/:code_fab" element={<EtapebymbrPage />} />
        <Route path="petitetapeaffiche/:id_mbr/:id_eta" element={<PetitetapeBrPage />} />
        <Route path="valeuretapebr/:id_mbr/:id_eta/:id_peta" element={<ValeuretapeBrPage />} />
        <Route path="encours/:code_fab/:id_camp" element={<EncoursBRPage />} />
        <Route path="detailencours/:id_mbr/:code_fab/:id_camp" element={<DetailencoursPage />} />

        <Route path="matiereaction/:id_mbr/:code_fab" element={<MatiereactionPage />} />
        <Route path="tableaumatiereaction/:id_mbr/:id_mat" element={<TableaumatiereactionPage />} />
        <Route path="echantillonaction/:id_mbr/:code_fab" element={<EchantillonactionPage />} />
        <Route path="etapeaction/:id_mbr/:code_fab" element={<EtapebymbractionPage />} />
        <Route path="petiteetapeaction/:id_mbr/:id_eta/:code_fab" element={<PetitetapembrActionPage />} />
        <Route path="valeuretapeaction/:id_mbr/:id_eta/:id_peta" element={<ValeuretapeactionBrPage/>} />
        <Route path="listedocument/:id_mbr" element={<ListedocumentPage />} />
        <Route path="campagne/:code_fab" element={<CampagnePage />} />
        <Route path="campagneEmission" element={<CampagneEmiPage />} />
        <Route path="campagneProduction/:id_pro" element={<CampagneprodPage />} />
        <Route path="terminerBR/:code_fab/:id_camp" element={<TerminerBrPage />} />
        <Route path="demandeBR/:code_fab/:id_camp" element={<DemandeBrPage />} />
        <Route path="campagneProduit" element={<ProduitsCampagneEnCoursProdPage />} />
            {/* ajoute d'autres sous-routes ici */}
        </Route>

          {/* Routes protégées pour OPROD */}
        <Route path="/OPROD" element={<ProtectedRoute><OuvrierLayout /> </ProtectedRoute> }>
            <Route path="campagneOuvrier/:id_pro" element={<CampagneOuvrierPage />} />
            <Route path="mbrOuvrier/:code_fab/:id_camp" element={<MbrOuvrierPage />} />
            <Route path="detailsOuvrier/:id_mbr/:code_fab/:id_camp" element={<DetailsOuvrierPage />} />
            <Route path="matiereOuvrier/:id_mbr/:code_fab" element={<MatiereOuvrierPage />} />
            <Route path="etapeOuvrier/:id_mbr/:code_fab/:id_camp" element={<EtapeOuvriePage />} />
            <Route path="petiteetapeOuvrier/:id_mbr/:id_eta/:code_fab" element={<PetiteEtapeOuvrierPage />} />
            <Route path="listeEchantillonsOuvrier/:id_mbr/:code_fab" element={<ListeEchantillonsOuvrierPage />} />
            <Route path="campagneProduitOuvrier" element={<ProduitsCampagneEnCoursOuvrierPage />} />
            {/* autres sous-routes ici */}
       
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Login />} />
      </Routes>

    </Router>
  );
}

export default App;
