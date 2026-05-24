// Document content extracted from Microbiologia_Virologia.docx
// This content is used by API routes for LLM-powered question generation and study content

export const DOCUMENT_TITLE = "Microbiología y Virología";

export const DOCUMENT_SECTIONS = [
  {
    id: "intro",
    title: "1. Introducción a la Microbiología",
    content: `La microbiología es la rama de la biología que se dedica al estudio de los microorganismos, es decir, aquellos seres vivos que solo pueden ser observados mediante el uso de microscopios. Esta disciplina abarca el análisis de su estructura, fisiología, genética, ecología, clasificación y su papel en los ecosistemas, así como su impacto en la salud humana, la industria y el medio ambiente. Los microorganismos incluyen bacterias, virus, hongos, protozoos y algas microscópicas, cada uno con características biológicas distintivas que determinan su forma de interactuar con el entorno y con otros organismos.

Desde el punto de vista de la clasificación celular, los seres vivos se organizan en tres grandes categorías que reflejan diferencias fundamentales en la complejidad y organización de sus células.

Es fundamental destacar que las bacterias se clasifican como procariotas, dado que carecen de núcleo verdadero y de orgánulos membranosos, mientras que los hongos son eucariotas, pues poseen un núcleo bien definido y orgánulos como mitocondrias y retículo endoplasmático. Los virus, por su parte, constituyen entidades acelulares que no pueden replicarse de forma independiente y requieren infectar una célula huésped para su multiplicación.`
  },
  {
    id: "bacterias",
    title: "2. Características Generales de las Bacterias",
    content: `Las bacterias son organismos unicelulares de organización procariota. A diferencia de lo que se podría pensar, el término «multiprocariota» se refiere a que muchas bacterias pueden formar agrupaciones o colonias de células procariotas, aunque cada célula individual sigue siendo un organismo independiente. Su tamaño oscila generalmente entre 0,5 y 5 µm, lo que las hace invisibles al ojo humano y requiere el uso de microscopía óptica o electrónica para su observación detallada.

Una de las estructuras más relevantes de la célula bacteriana es la pared celular, compuesta principalmente de peptidoglucano (también denominado mureína), un polímero que confiere rigidez y protección frente a la presión osmótica del medio exterior. Algunas bacterias poseen además una cápsula, una capa externa de naturaleza polisacárida (y en algunos casos polipeptídica) que les proporciona protección contra la desecación, la fagocitosis y los agentes antimicrobianos, además de facilitar la adhesión a superficies.

El material genético de las bacterias consiste en una molécula de ADN circular que se encuentra dispersa en el citoplasma, en una región denominada nucleoide, sin estar rodeada por una membrana nuclear. Adicionalmente, muchas bacterias contienen plásmidos, pequeñas moléculas de ADN extracromosómico que portan genes de resistencia a antibióticos y otros factores de virulencia, y que pueden transferirse entre bacterias mediante conjugación.

En cuanto a la motilidad, ciertas bacterias disponen de flagelos, apéndices filamentosos compuestos por la proteína flagelina, que les permiten desplazarse en medios líquidos mediante movimientos rotatorios. Otros apéndices superficiales incluyen los pilis o fimbrias, estructuras proteicas más cortas y delgadas que los flagelos, que intervienen en la adhesión a superficies y en la transferencia de material genético durante la conjugación bacteriana.`
  },
  {
    id: "clasificacion-bacterias",
    title: "3. Clasificación de las Bacterias",
    content: `Las bacterias pueden clasificarse según múltiples criterios que reflejan su diversidad morfológica, metabólica y estructural.

3.1 Clasificación según la forma
La morfología bacteriana es uno de los criterios más utilizados para la identificación preliminar. Las formas principales incluyen los bacilos (bastones alargados, como Escherichia coli y Bacillus subtilis), los cocos (esféricos, como Staphylococcus aureus y Streptococcus pneumoniae) y los espirilos (forma helicoidal o espiral, como Treponema pallidum y Spirillum volutans). Existen además formas intermedias como los vibrios (bacilos curvados en forma de coma, como Vibrio cholerae) y los espiroquetas (espirilos muy flexibles con filamentos axiales internos).

3.2 Clasificación según la respiración
De acuerdo con sus requerimientos de oxígeno, las bacterias se dividen en tres grandes grupos: aerobias estrictas, que necesitan oxígeno para sobrevivir y llevar a cabo la cadena de transporte de electrones (por ejemplo, Mycobacterium tuberculosis); anaerobias estrictas, para las cuales el oxígeno es tóxico y obtienen energía mediante fermentación o respiración anaerobia (como Clostridium tetani); y anaerobias facultativas, que pueden crecer tanto en presencia como en ausencia de oxígeno, alternando entre respiración aerobia y fermentación según la disponibilidad (Escherichia coli es un ejemplo paradigmático).

3.3 Clasificación según la nutrición
Atendiendo a su fuente de carbono y energía, las bacteras se clasifican en: heterótrofas, que utilizan compuestos orgánicos preformados como fuente de carbono y energía (la mayoría de las bacterias patógenas son heterótrofas); autótrofas, que emplean dióxido de carbono (CO₂) como fuente de carbono y obtienen energía de la luz (fotoautótrofas, como las cianobacterias) o de reacciones químicas inorgánicas (quimioautótrofas); y las quimiosintéticas, un subgrupo de autótrofas que oxidan compuestos inorgánicos (como amoníaco, azufre o hierro ferroso) para generar energía y fijar CO₂.

3.4 Clasificación según la pared celular: Tinción de Gram
La tinción de Gram, desarrollada por Hans Christian Gram en 1884, es el método diferencial de laboratorio más ampliamente utilizado para clasificar bacterias. Se basa en las diferencias estructurales de la pared celular, que determinan la retención o no del cristal violeta tras la decoloración con alcohol o acetona. Las bacterias Gram positivas presentan una capa gruesa de peptidoglucano con ácidos teicoicos y retienen el cristal violeta (color violeta/azul). Las bacterias Gram negativas poseen una membrana externa con lipopolisacárido (LPS), una capa fina de peptidoglucano sin ácidos teicoicos, y no retienen el cristal violeta (color rosa/rojo con safranina).`
  },
  {
    id: "estructura-celular",
    title: "4. Estructura Celular Bacteriana",
    content: `La célula bacteriana posee un conjunto de estructuras que se clasifican en dos grandes grupos: las estructuras básicas, presentes en prácticamente todas las bacterias, y las estructuras especializadas, que solo se encuentran en determinados grupos y confieren ventajas adaptativas específicas.

4.1 Estructuras básicas
El citoplasma es la matriz semilíquida que ocupa el interior de la célula, compuesta principalmente por agua (aproximadamente 80%), enzimas, nucleótidos, aminoácidos y otras moléculas esenciales para el metabolismo celular. En él se encuentran inmersos los ribosomas y el nucleoide. Los ribosomas bacterianos son de tipo 70S (subunidades 50S y 30S), a diferencia de los ribosomas eucariotas que son 80S. Estos orgánulos no membranosos son el sitio de la síntesis proteica y constituyen el blanco de acción de numerosos antibióticos, como los aminoglucósidos (que se unen a la subunidad 30S) y los macrólidos (que se unen a la subunidad 50S).

El nucleoide es la región del citoplasma donde se localiza el cromosoma bacteriano, una molécula de ADN circular de doble cadena que contiene la información genética esencial. La membrana citoplasmática (o membrana plasmática) es una bicapa lipídica con proteínas integradas que delimita el contenido celular y regula el transporte de sustancias, la producción de energía mediante la cadena de transporte de electrones y la señalización celular. En bacterias, carece de colesterol, pero contiene hopanoides que cumplen una función estabilizadora análoga.

4.2 Estructuras especializadas
La pared celular es una estructura rígida exterior a la membrana citoplasmática que mantiene la forma de la célula y previene su lisis osmótica. La cápsula es una capa externa de polisacáridos que confiere resistencia a la fagocitosis y contribuye a la virulencia de patógenos como Streptococcus pneumoniae y Klebsiella pneumoniae. Los flagelos son apéndices de motilidad compuestos por tres partes: filamento (flagelina), gancho y cuerpo basal con motor rotatorio, que permiten el desplazamiento en medios líquidos mediante quimiotaxis.`
  },
  {
    id: "reproduccion",
    title: "5. Reproducción y Supervivencia Bacteriana",
    content: `La reproducción bacteriana se realiza principalmente mediante fisión binaria, un proceso asexual en el cual la célula madre se duplica su ADN, crece y se divide en dos células hijas genéticamente idénticas. En condiciones óptimas, algunas bacterias como E. coli pueden dividirse cada 20 minutos, lo que explica su enorme potencial de crecimiento exponencial. Sin embargo, en la naturaleza, el crecimiento se ve limitado por la disponibilidad de nutrientes, la acumulación de desechos y otros factores ambientales.

Aunque la fisión binaria produce células genéticamente idénticas, las bacterias poseen mecanismos de intercambio genético horizontal que generan diversidad genética sin necesidad de reproducción sexual. Estos mecanismos incluyen la conjugación (transferencia de ADN mediante pilus sexual entre dos bacterias), la transformación (captación de ADN libre del medio ambiente) y la transducción (transferencia de ADN mediada por bacteriófagos). Estos procesos son clínicamente relevantes porque facilitan la diseminación de genes de resistencia a antibióticos entre poblaciones bacterianas.

Las biopelículas son comunidades estructuradas de bacterias adheridas a una superficie y envueltas en una matriz extracelular de exopolisacáridos. Esta forma de crecimiento comunitario confiere mayor resistencia a antibióticos, desinfectantes y respuestas inmunitarias del huésped, lo que convierte a las biopelículas en un problema importante en infecciones crónicas y en contaminación de dispositivos médicos. Las endosporas, por su parte, son estructuras de resistencia formadas por ciertos géneros bacterianos (Bacillus y Clostridium) en condiciones de estrés ambiental. Son extremadamente resistentes al calor, la radiación, los desinfectantes y la desecación, pudiendo permanecer viables durante años o incluso siglos.`
  },
  {
    id: "virus",
    title: "6. Los Virus",
    content: `Los virus son entes biológicos microscópicos que se sitúan en el límite entre lo vivo y lo inerte. Carecen de metabolismo propio, es decir, no poseen maquinaria enzimática para generar ATP, sintetizar proteínas ni replicar su material genético de forma independiente. Por esta razón, se les denomina parásitos obligados, ya que dependen por completo de la maquinaria metabólica de una célula huésped para replicarse. Un virus fuera de su célula huésped recibe el nombre de virión, y está compuesto fundamentalmente por un ácido nucleico (ADN o ARN) rodeado por una cápside proteica; algunos poseen además una envoltura lipídica externa derivada de la membrana de la célula huésped.

El tamaño de los virus oscila entre 20 y 300 nm, considerablemente menor que el de las bacterias, lo que hace necesaria la microscopía electrónica para su visualización directa. A diferencia de las células, los virus no crecen ni se dividen; en su lugar, se ensamblan a partir de componentes sintetizados por la célula infectada. Su especificidad por el huésped está determinada por la interacción entre las proteínas de la superficie viral y los receptores de la célula diana, lo que explica por qué ciertos virus infectan solo un tipo celular o una especie determinada.`
  },
  {
    id: "clasificacion-morfologica",
    title: "7. Clasificación Morfológica Viral",
    content: `La morfología viral se define por la simetría de la cápside y la presencia o ausencia de envoltura lipídica. El sistema de clasificación del Comité Internacional de Taxonomía de Virus (ICTV) reconoce cuatro tipos morfológicos principales:

- Icosahédrica: simetría icosaédrica, sin envoltura. Ejemplos: adenovirus, poliovirus, parvovirus.
- Icosahédrica con envoltura: simetría icosaédrica con envoltura lipídica. Ejemplos: herpesvirus, flavivirus (dengue, Zika).
- Helicoidal: simetría helicoidal, sin envoltura. Ejemplos: virus del mosaico del tabaco (TMV), aunque la mayoría de los virus helicoidales de animales poseen envoltura.
- Helicoidal con envoltura: simetría helicoidal con envoltura lipídica. Ejemplos: virus de la influenza, coronavirus, virus de la rabia.

Es importante destacar que la presencia de envoltura lipídica tiene implicaciones prácticas relevantes: los virus envelopados son más sensibles a detergentes, desinfectantes y condiciones ambientales adversas (deshidratación, calor), mientras que los virus no envelopados son más resistentes en el ambiente exterior. Esta diferencia es crucial para las estrategias de desinfección y control de infecciones en entornos hospitalarios.`
  },
  {
    id: "clasificacion-acido-nucleico",
    title: "8. Clasificación por Composición y Ácido Nucleico",
    content: `Además de la morfología, los virus se clasifican según la naturaleza de su genoma, que puede estar constituido por ADN o ARN, y presentarse en forma monocatenaria (simple cadena, ss) o bicatenaria (doble cadena, ds).

8.1 Virus de ADN
Los virus de ADN poseen un genoma compuesto por ácido desoxirribonucleico. Pueden ser bicatenarios (dsADN), como los herpesvirus (virus del herpes simple, varicela-zóster y citomegalovirus), los adenovirus y los poxvirus, que replican su genoma utilizando ADN polimerasas viral o celular; o monocatenarios (ssADN), como los parvovirus (incluyendo B19, agente del eritema infeccioso), que deben convertir su ADN de cadena simple en doble cadena antes de la replicación. En general, los virus de ADN tienden a ser más estables genéticamente que los de ARN debido a la mayor fidelidad de las ADN polimerasas.

8.2 Virus de ARN
Los virus de ARN representan el grupo más numeroso y diverso de virus. Su genoma está compuesto por ácido ribonucleico, y la mayoría presenta una tasa de mutación elevada debido a la falta de capacidad correctora de las ARN polimerasas virales, lo que les confiere gran variabilidad genética y capacidad de evasión inmunitaria.

Los retrovirus son virus de ARN monocatenario que utilizan una enzima única, la transcriptasa inversa, para convertir su ARN en ADN proviral, que se integra en el genoma del huésped. El VIH (Virus de la Inmunodeficiencia Humana) es el retrovirus más conocido y agente causal del síndrome de inmunodeficiencia adquirida (SIDA). La integración del provirus permite la latencia viral, lo que dificulta la erradicación de la infección.

Otros virus de ARN se clasifican según la polaridad de su genoma: los de ARN monocatenario positivo (+)ssARN funcionan directamente como ARN mensajero y pueden ser traducidos inmediatamente por los ribosomas del huésped (ejemplos: coronavirus como SARS-CoV-2, virus de la poliomielitis, virus de la hepatitis C); mientras que los de ARN monocatenario negativo (−)ssARN necesitan ser transcritos a ARN complementario positivo por una ARN polimerasa viral antes de poder ser traducidos (ejemplos: virus de la influenza, virus del Ébola, virus de la rabia). Adicionalmente, existen virus de ARN bicatenario (dsARN), como los rotavirus, que contienen segmentos de ARN de doble cadena y son causa importante de gastroenteritis en niños.`
  }
];

export const FULL_DOCUMENT_TEXT = DOCUMENT_SECTIONS.map(s => `${s.title}\n\n${s.content}`).join('\n\n');

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
}
