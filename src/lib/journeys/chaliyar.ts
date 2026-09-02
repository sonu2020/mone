// ============================================================================
// The Chaliyar — 105 km from the Nilgiri foothills to the sea at Beypore.
//
// The first entry in Rivers of Kerala, and the second journey built on
// `terrain-journey` — which is the point of it. A road climbing a ghat and a
// river running to the sea are the same shape of thing: an ordered line through
// real terrain with named places on it.
//
// ── Where the data came from ────────────────────────────────────────────────
//
//   Line     /Users/muneef/Sites/static/rivers — src/assets/chaliyar.json,
//            OpenStreetMap way/943346262, 284 points after thinning,
//            oriented downstream.
//   Towns    OpenStreetMap via Overpass, with Malayalam names.
//   Heights  AWS Terrain Tiles (terrarium).
//
// ── Why the towns were looked up again ──────────────────────────────────────
//
// The rivers repo carries its own town list in src/data/pois.ts, rounded to two
// or three decimal places — about a kilometre — and one of them is not rounded
// but wrong: "Nilambur" is given as 11.510, 76.213, which is the FIRST VERTEX OF
// THE RIVER, up in the hills some 25 km from the town at 11.287. Someone
// labelled a headwater with the name of a place downstream.
//
// So every town here was re-queried from OSM. The distances below are from each
// town centre to the nearest point on the river, and they are the check as much
// as the data: a town genuinely on the Chaliyar sits a few hundred metres from
// it. Most of these do. Kavanoor at 3.0 km and Chungathara at 1.5 km are named
// on the river but centred well back from it, which is worth knowing before
// anyone reads a label as marking a riverbank. Anything beyond 3.5 km was
// dropped rather than fudged.
//
//   Pothukal   11.40411, 76.25267    43 m   km  16.02    429 m from the water
//   Chungathara 11.33378, 76.27566    36 m   km  27.45   1461 m from the water
//   Nilambur   11.28651, 76.24074    43 m   km  35.17   1043 m from the water
//   Mampad     11.24466, 76.17936    29 m   km  44.73    325 m from the water
//   Edavanna   11.21333, 76.13851    20 m   km  53.48    668 m from the water
//   Kavanoor   11.19464, 76.06455    36 m   km  63.80   2986 m from the water
//   Areekode   11.23456, 76.04918    31 m   km  66.15    520 m from the water
//   Feroke     11.18254, 75.83754    21 m   km 100.89    321 m from the water
//   Beypore    11.17907, 75.81018    13 m   km 103.00    818 m from the water
//   Chaliyam   11.15596, 75.80952    10 m   km 105.30    947 m from the water
//
// ── The river, and what this line is a part of ──────────────────────────────
//
// From the English Wikipedia article "Chaliyar" (CC BY-SA), which is the source
// for everything in this block and for the context section on the page:
//
//   Length        169 km — the fourth longest river in Kerala
//   Rises         Elambaleri Hills, in the Nilgiris of the Western Ghats,
//                 Wayanad district, near the Malappuram border
//   Also called   Chulika, Nilambur river, Beypore river
//   Basin         2,933 km²
//   Mouth         The Lakshadweep Sea at Beypore, opposite Chaliyam
//   Tributaries   Cherupuzha, Iruvanjippuzha, Kuthirappuzha, Karimpuzha,
//                 Kanjirappuzha, and many sub-tributaries
//
// ── 105 km against a cited 169 ──────────────────────────────────────────────
//
// This line measures 105 km. The river is usually given as 169 km. The
// discrepancy is real and is NOT resolved here, so the page states both rather
// than picking one:
//
//   - The OSM way carries the name "Chaliyar river" and begins at 155 m near the
//     Wayanad-Malappuram border. The cited source is higher, in the Elambaleri
//     Hills, so some upper course is certainly missing.
//   - Kerala river lengths are also commonly quoted from a headwater tributary
//     rather than from where the main name begins, which would account for part
//     of the difference on its own.
//
// Which of those dominates is not something this data can answer, and inventing
// a reconciliation would be worse than reporting the gap.
//
// ── On the profile ──────────────────────────────────────────────────────────
//
// Sampled elevations are forced to descend monotonically. A DEM is a surface
// model sampled at tens of metres, so over open water it is noisy and reads
// uphill in places; a river that climbs is a sampling artefact, not terrain,
// and the raw figures would put a false character on the one line that must
// read as falling. Nothing else is smoothed.
// ============================================================================

import type { Journey } from 'terrain-journey';

const route: Journey['route'] = [
  [76.213068, 11.510184, 155.0, 0.0],
  [76.214624, 11.5103, 146.0, 172.0],
  [76.215257, 11.510374, 145.0, 241.5],
  [76.216405, 11.5101, 135.0, 370.6],
  [76.217639, 11.510742, 127.0, 523.8],
  [76.21898, 11.511236, 126.0, 680.0],
  [76.220106, 11.511824, 126.0, 819.6],
  [76.221314, 11.5121, 126.0, 957.6],
  [76.223501, 11.51048, 124.0, 1263.5],
  [76.224358, 11.509416, 124.0, 1414.2],
  [76.225868, 11.507977, 122.0, 1644.2],
  [76.228153, 11.505937, 114.0, 1981.5],
  [76.229086, 11.50457, 112.0, 2166.4],
  [76.228968, 11.503458, 112.0, 2291.2],
  [76.228443, 11.502017, 107.0, 2461.4],
  [76.228612, 11.500828, 107.0, 2596.9],
  [76.229118, 11.499633, 107.0, 2740.8],
  [76.22911, 11.498573, 107.0, 2860.5],
  [76.228925, 11.497436, 107.0, 2988.8],
  [76.229408, 11.494857, 97.0, 3281.5],
  [76.22958, 11.493406, 97.0, 3445.3],
  [76.229469, 11.492498, 97.0, 3547.2],
  [76.22899, 11.491608, 97.0, 3661.6],
  [76.228464, 11.490906, 93.0, 3758.4],
  [76.227541, 11.490065, 93.0, 3896.5],
  [76.227413, 11.48915, 93.0, 4003.7],
  [76.227852, 11.488036, 93.0, 4136.6],
  [76.228044, 11.487048, 91.0, 4248.3],
  [76.228239, 11.486122, 87.0, 4353.5],
  [76.228893, 11.484818, 85.0, 4516.8],
  [76.229483, 11.484261, 85.0, 4606.1],
  [76.230352, 11.483231, 83.0, 4754.8],
  [76.230427, 11.48194, 83.0, 4901.0],
  [76.229837, 11.479806, 82.0, 5147.0],
  [76.228904, 11.478929, 82.0, 5299.4],
  [76.228829, 11.478199, 81.0, 5381.0],
  [76.228625, 11.476296, 79.0, 5594.1],
  [76.22767, 11.474284, 74.0, 5841.2],
  [76.228164, 11.472728, 74.0, 6025.9],
  [76.2284, 11.471225, 71.0, 6195.6],
  [76.228378, 11.468513, 71.0, 6497.6],
  [76.228732, 11.466852, 71.0, 6688.9],
  [76.230181, 11.46554, 71.0, 6907.4],
  [76.231479, 11.464236, 65.0, 7110.9],
  [76.231983, 11.461634, 62.0, 7405.4],
  [76.232637, 11.458785, 62.0, 7730.2],
  [76.234054, 11.456762, 61.0, 8006.4],
  [76.23685, 11.454113, 59.0, 8431.3],
  [76.237697, 11.452693, 59.0, 8614.2],
  [76.238674, 11.450047, 59.0, 8927.2],
  [76.238996, 11.448112, 59.0, 9146.2],
  [76.238148, 11.446734, 59.0, 9327.9],
  [76.236968, 11.445694, 53.0, 9501.1],
  [76.236657, 11.444222, 53.0, 9675.6],
  [76.237247, 11.44256, 51.0, 9871.3],
  [76.236903, 11.440433, 51.0, 10112.4],
  [76.236667, 11.438645, 50.0, 10315.6],
  [76.23829, 11.436987, 49.0, 10576.8],
  [76.240232, 11.435778, 49.0, 10827.6],
  [76.241633, 11.435273, 48.0, 10990.4],
  [76.242423, 11.434781, 46.0, 11092.5],
  [76.243905, 11.433676, 46.0, 11297.5],
  [76.244443, 11.431952, 46.0, 11509.0],
  [76.243478, 11.430162, 43.0, 11735.8],
  [76.242988, 11.429266, 43.0, 11853.1],
  [76.244047, 11.427604, 43.0, 12073.3],
  [76.24453, 11.423365, 43.0, 12551.1],
  [76.244296, 11.421455, 43.0, 12767.4],
  [76.243394, 11.421168, 43.0, 12883.0],
  [76.242148, 11.420312, 41.0, 13052.2],
  [76.241805, 11.418156, 38.0, 13297.2],
  [76.244002, 11.41644, 36.0, 13606.5],
  [76.246426, 11.415451, 36.0, 13892.8],
  [76.248508, 11.416251, 36.0, 14138.2],
  [76.25134, 11.416966, 36.0, 14460.5],
  [76.25398, 11.415977, 34.0, 14773.5],
  [76.254388, 11.413638, 33.0, 15057.1],
  [76.253808, 11.410589, 33.0, 15402.2],
  [76.251362, 11.407812, 33.0, 15816.0],
  [76.249813, 11.406767, 28.0, 16021.0],
  [76.248459, 11.405853, 28.0, 16200.2],
  [76.245841, 11.403329, 28.0, 16600.8],
  [76.243545, 11.401856, 28.0, 16900.5],
  [76.24436, 11.399984, 28.0, 17161.4],
  [76.246193, 11.398364, 28.0, 17434.1],
  [76.2466, 11.395903, 28.0, 17712.9],
  [76.246772, 11.393085, 28.0, 18028.9],
  [76.248274, 11.39157, 28.0, 18272.3],
  [76.24944, 11.39042, 28.0, 18468.3],
  [76.250664, 11.38779, 28.0, 18793.5],
  [76.253367, 11.386507, 28.0, 19121.0],
  [76.255228, 11.385604, 28.0, 19349.6],
  [76.256756, 11.385506, 28.0, 19521.8],
  [76.256038, 11.384079, 28.0, 19728.8],
  [76.25518, 11.381801, 28.0, 19998.9],
  [76.254747, 11.380879, 28.0, 20113.8],
  [76.254948, 11.379747, 28.0, 20241.7],
  [76.254955, 11.377503, 28.0, 20493.1],
  [76.25341, 11.374946, 28.0, 20831.2],
  [76.252058, 11.373894, 26.0, 21022.0],
  [76.250384, 11.37259, 22.0, 21261.1],
  [76.251672, 11.371307, 22.0, 21517.0],
  [76.25444, 11.37137, 22.0, 21821.5],
  [76.257659, 11.371854, 22.0, 22177.0],
  [76.259139, 11.371181, 22.0, 22366.2],
  [76.258495, 11.369771, 22.0, 22543.6],
  [76.256285, 11.366354, 22.0, 22999.8],
  [76.256564, 11.364461, 22.0, 23217.1],
  [76.25695, 11.361873, 22.0, 23542.1],
  [76.256264, 11.359503, 22.0, 23831.1],
  [76.256958, 11.356782, 22.0, 24144.8],
  [76.257861, 11.355088, 22.0, 24359.2],
  [76.259397, 11.352103, 22.0, 24731.1],
  [76.261452, 11.349458, 22.0, 25101.0],
  [76.261174, 11.347603, 22.0, 25313.3],
  [76.259714, 11.345268, 22.0, 25630.4],
  [76.259802, 11.343727, 21.0, 25802.9],
  [76.259772, 11.341822, 21.0, 26016.7],
  [76.259368, 11.33879, 21.0, 26357.2],
  [76.258792, 11.336747, 21.0, 26601.3],
  [76.259013, 11.334874, 21.0, 26819.8],
  [76.260233, 11.33381, 19.0, 27005.1],
  [76.262249, 11.332002, 19.0, 27311.0],
  [76.262595, 11.330844, 19.0, 27445.2],
  [76.262047, 11.330006, 19.0, 27555.8],
  [76.260348, 11.327191, 19.0, 27920.0],
  [76.258773, 11.325731, 19.0, 28157.0],
  [76.256766, 11.32543, 19.0, 28412.8],
  [76.254567, 11.327087, 19.0, 28716.2],
  [76.251763, 11.327596, 19.0, 29039.4],
  [76.248364, 11.326701, 17.0, 29423.5],
  [76.247768, 11.32462, 16.0, 29664.9],
  [76.24797, 11.322831, 16.0, 29893.6],
  [76.245809, 11.321287, 16.0, 30187.8],
  [76.244148, 11.319056, 16.0, 30495.1],
  [76.243143, 11.317078, 16.0, 30743.6],
  [76.242328, 11.316697, 10.0, 30842.1],
  [76.241308, 11.315645, 10.0, 31005.0],
  [76.240391, 11.315635, 10.0, 31105.8],
  [76.239254, 11.315582, 10.0, 31230.5],
  [76.238589, 11.315267, 10.0, 31312.2],
  [76.237517, 11.313859, 10.0, 31510.9],
  [76.236834, 11.311754, 10.0, 31757.7],
  [76.237625, 11.310508, 10.0, 31935.4],
  [76.239603, 11.307273, 10.0, 32355.9],
  [76.240711, 11.304672, 10.0, 32670.6],
  [76.240598, 11.302743, 10.0, 32887.8],
  [76.238188, 11.300079, 8.0, 33287.6],
  [76.234216, 11.298181, 8.0, 33770.7],
  [76.232282, 11.297079, 8.0, 34017.2],
  [76.231168, 11.293813, 8.0, 34405.2],
  [76.231456, 11.289221, 8.0, 34916.8],
  [76.231183, 11.286986, 4.0, 35167.1],
  [76.230676, 11.286006, 4.0, 35289.3],
  [76.228326, 11.283672, 4.0, 35658.4],
  [76.22782, 11.282827, 4.0, 35767.3],
  [76.226985, 11.281302, 4.0, 35963.8],
  [76.225448, 11.281176, 4.0, 36139.9],
  [76.22486, 11.282304, 4.0, 36291.5],
  [76.223913, 11.283415, 4.0, 36464.9],
  [76.222424, 11.284907, 4.0, 36697.9],
  [76.220282, 11.28635, 4.0, 36981.5],
  [76.21701, 11.286896, 4.0, 37345.3],
  [76.214074, 11.286166, 4.0, 37678.4],
  [76.212881, 11.284301, 4.0, 37934.9],
  [76.213287, 11.282471, 4.0, 38145.0],
  [76.214685, 11.280121, 4.0, 38448.2],
  [76.215531, 11.278891, 4.0, 38614.6],
  [76.216318, 11.277996, 4.0, 38747.5],
  [76.216471, 11.276968, 4.0, 38863.1],
  [76.216292, 11.276048, 4.0, 38967.9],
  [76.215449, 11.275121, 4.0, 39106.4],
  [76.210097, 11.271986, 4.0, 39786.3],
  [76.209143, 11.271098, 4.0, 39930.7],
  [76.207617, 11.268724, 4.0, 40243.1],
  [76.205189, 11.267514, 4.0, 40543.6],
  [76.203174, 11.267115, 4.0, 40768.3],
  [76.201724, 11.26728, 4.0, 40927.5],
  [76.198225, 11.266851, 4.0, 41331.4],
  [76.188891, 11.260177, 4.0, 42598.4],
  [76.185865, 11.257819, 4.0, 43021.2],
  [76.184101, 11.256696, 4.0, 43251.0],
  [76.181919, 11.25483, 4.0, 43567.3],
  [76.18061, 11.253309, 4.0, 43790.5],
  [76.178364, 11.247981, 4.0, 44432.2],
  [76.176645, 11.245875, 4.0, 44732.1],
  [76.175428, 11.244778, 4.0, 44912.4],
  [76.174607, 11.244038, 4.0, 45034.0],
  [76.16863, 11.239631, 4.0, 45851.0],
  [76.165889, 11.238817, 4.0, 46163.4],
  [76.161958, 11.239844, 4.0, 46607.1],
  [76.159481, 11.237732, 4.0, 46990.6],
  [76.160503, 11.232936, 3.0, 47535.6],
  [76.159765, 11.232088, 3.0, 47660.3],
  [76.157953, 11.231141, 3.0, 47887.2],
  [76.155764, 11.234604, 3.0, 48345.2],
  [76.152928, 11.239094, 3.0, 48961.8],
  [76.149419, 11.239319, 3.0, 49362.0],
  [76.14903, 11.235717, 3.0, 49858.0],
  [76.153095, 11.23241, 3.0, 50434.1],
  [76.151716, 11.228029, 3.0, 50949.2],
  [76.147536, 11.226647, 3.0, 51434.0],
  [76.143928, 11.22825, 3.0, 51877.3],
  [76.141781, 11.226551, 3.0, 52195.1],
  [76.142528, 11.224542, 3.0, 52448.5],
  [76.144383, 11.223077, 3.0, 52709.2],
  [76.143785, 11.220069, 3.0, 53108.6],
  [76.140684, 11.218945, 3.0, 53478.7],
  [76.136184, 11.22167, 3.0, 54063.7],
  [76.131023, 11.225507, 3.0, 54797.3],
  [76.126197, 11.222493, 3.0, 55421.4],
  [76.121633, 11.225858, 3.0, 56045.7],
  [76.117694, 11.225292, 3.0, 56498.4],
  [76.113116, 11.222129, 3.0, 57117.3],
  [76.108347, 11.223868, 3.0, 57672.4],
  [76.103718, 11.220355, 3.0, 58337.0],
  [76.097802, 11.214884, 3.0, 59225.5],
  [76.096548, 11.214018, 3.0, 59394.4],
  [76.095034, 11.214545, 3.0, 59586.1],
  [76.094949, 11.216647, 3.0, 59821.3],
  [76.094387, 11.220338, 3.0, 60237.1],
  [76.093832, 11.22078, 3.0, 60315.1],
  [76.089941, 11.221784, 3.0, 60770.1],
  [76.086008, 11.219089, 3.0, 61298.8],
  [76.078778, 11.221635, 3.0, 62143.6],
  [76.063626, 11.221479, 3.0, 63800.4],
  [76.057922, 11.224024, 3.0, 64503.1],
  [76.058278, 11.230299, 3.0, 65202.6],
  [76.054826, 11.234369, 3.0, 65792.5],
  [76.053145, 11.237154, 3.0, 66152.4],
  [76.049875, 11.24163, 3.0, 66770.1],
  [76.04806, 11.242138, 3.0, 66976.0],
  [76.045719, 11.240759, 3.0, 67281.8],
  [76.040469, 11.236658, 0.0, 68031.4],
  [76.036226, 11.238277, 0.0, 68535.2],
  [76.036155, 11.24415, 0.0, 69200.7],
  [76.034646, 11.246092, 0.0, 69484.2],
  [76.029389, 11.2463, 0.0, 70072.9],
  [76.022788, 11.238994, -2.0, 71166.0],
  [76.017083, 11.236566, -2.0, 71856.0],
  [76.010459, 11.239526, -2.0, 72678.9],
  [76.002137, 11.247202, -2.0, 73924.8],
  [76.000439, 11.247688, -2.0, 74117.6],
  [75.996385, 11.242717, -2.0, 74842.3],
  [75.994782, 11.242, -2.0, 75034.5],
  [75.993061, 11.244266, -2.0, 75377.5],
  [75.996055, 11.250254, -2.0, 76143.3],
  [75.995512, 11.25474, -2.0, 76663.8],
  [75.987092, 11.260975, -2.0, 77816.9],
  [75.977612, 11.267058, -2.0, 79053.6],
  [75.974814, 11.268497, -2.0, 79402.6],
  [75.96595, 11.26267, -2.0, 80579.6],
  [75.95962, 11.253549, -2.0, 81813.0],
  [75.955648, 11.251387, -2.0, 82311.7],
  [75.947397, 11.250254, -2.0, 83220.4],
  [75.931062, 11.247321, -2.0, 85031.4],
  [75.926619, 11.245858, -2.0, 85542.6],
  [75.924841, 11.245519, -2.0, 85740.1],
  [75.921604, 11.241241, -2.0, 86354.9],
  [75.916048, 11.236467, -2.0, 87180.2],
  [75.909587, 11.239303, -2.0, 87975.8],
  [75.901769, 11.243267, -2.0, 88939.1],
  [75.900024, 11.242637, -2.0, 89141.8],
  [75.898371, 11.232369, -2.0, 90297.8],
  [75.895157, 11.229577, -2.0, 90766.1],
  [75.887929, 11.228651, -2.0, 91567.4],
  [75.877893, 11.222596, -2.0, 92865.3],
  [75.875185, 11.216453, -2.0, 93614.4],
  [75.86894, 11.211022, -2.0, 94529.6],
  [75.862466, 11.205302, -2.0, 95517.0],
  [75.857644, 11.207999, -2.0, 96138.4],
  [75.853351, 11.209293, -2.0, 96629.8],
  [75.851585, 11.209483, -2.0, 96824.1],
  [75.840932, 11.206202, -2.0, 98096.6],
  [75.836065, 11.198095, -2.0, 99142.8],
  [75.836713, 11.190456, -2.0, 99995.1],
  [75.834605, 11.182781, -2.0, 100893.2],
  [75.822403, 11.179679, -2.0, 102296.0],
  [75.820707, 11.178968, -2.0, 102497.1],
  [75.818227, 11.177929, -2.0, 102791.3],
  [75.817153, 11.176371, -2.0, 103000.5],
  [75.810687, 11.166993, -2.0, 104259.4],
  [75.809027, 11.16529, -2.0, 104521.4],
  [75.803017, 11.161596, -2.0, 105295.1],
];

const markers: Journey['markers'] = [
  { n: 1, i: 0, coords: [76.252673, 11.404111], elevation: 43, km: 16.02, title: 'Pothukal', titleLocal: 'പോത്തുകല്ല്', detail: '43 m · 16.0 km downstream · 429 m from the water' },
  { n: 2, i: 0, coords: [76.275658, 11.333781], elevation: 36, km: 27.45, title: 'Chungathara', titleLocal: 'ചുങ്കത്തറ', detail: '36 m · 27.4 km downstream · 1.5 km from the water' },
  { n: 3, i: 0, coords: [76.240739, 11.286508], elevation: 43, km: 35.17, title: 'Nilambur', titleLocal: 'നിലമ്പൂർ', detail: '43 m · 35.2 km downstream · 1.0 km from the water', note: 'Conolly&rsquo;s Plot, the oldest man-made teak plantation in the world, lies near here. The river is often called the Nilambur river along this stretch, and the banks hold gold placers — on the order of 2.5 million cubic metres of them, carrying about a tenth of a gram of gold per cubic metre.' },
  { n: 4, i: 0, coords: [76.17936, 11.244661], elevation: 29, km: 44.73, title: 'Mampad', titleLocal: 'മമ്പാട്', detail: '29 m · 44.7 km downstream · 325 m from the water' },
  { n: 5, i: 0, coords: [76.138511, 11.213328], elevation: 20, km: 53.48, title: 'Edavanna', titleLocal: 'എടവണ്ണ', detail: '20 m · 53.5 km downstream · 668 m from the water' },
  { n: 6, i: 0, coords: [76.064549, 11.194643], elevation: 36, km: 63.8, title: 'Kavanoor', titleLocal: 'കാവനൂർ', detail: '36 m · 63.8 km downstream · 3.0 km from the water' },
  { n: 7, i: 0, coords: [76.049183, 11.234559], elevation: 31, km: 66.15, title: 'Areekode', titleLocal: 'അരീക്കോട്', detail: '31 m · 66.2 km downstream · 520 m from the water' },
  { n: 8, i: 0, coords: [75.837537, 11.182545], elevation: 21, km: 100.89, title: 'Feroke', titleLocal: 'ഫറോക്ക്', detail: '21 m · 100.9 km downstream · 321 m from the water', note: 'By here the Chaliyar has finished the seventeen-odd kilometres it spends as the boundary between Malappuram and Kozhikode, and is running its last stretch inside Kozhikode.' },
  { n: 9, i: 0, coords: [75.810177, 11.179067], elevation: 13, km: 103.0, title: 'Beypore', titleLocal: 'ബേപ്പൂര്‍', detail: '13 m · 103.0 km downstream · 818 m from the water', note: 'The river reaches the Lakshadweep Sea here, opposite Chaliyam harbour — which is why the lower Chaliyar is also known as the Beypore river.' },
  { n: 10, i: 0, coords: [75.809522, 11.155958], elevation: 10, km: 105.3, title: 'Chaliyam', titleLocal: 'ചാലിയം', detail: '10 m · 105.3 km downstream · 947 m from the water', note: 'The south side of the mouth, facing Beypore across the water. The river ends here.' },
];

const places: Journey['places'] = [
  { id: 'pothukal', name: 'Pothukal', nameLocal: 'പോത്തുകല്ല്', coords: [76.252673, 11.404111], elevation: 43 },
  { id: 'chungathara', name: 'Chungathara', nameLocal: 'ചുങ്കത്തറ', coords: [76.275658, 11.333781], elevation: 36 },
  { id: 'nilambur', name: 'Nilambur', nameLocal: 'നിലമ്പൂർ', coords: [76.240739, 11.286508], elevation: 43 },
  { id: 'mampad', name: 'Mampad', nameLocal: 'മമ്പാട്', coords: [76.17936, 11.244661], elevation: 29 },
  { id: 'edavanna', name: 'Edavanna', nameLocal: 'എടവണ്ണ', coords: [76.138511, 11.213328], elevation: 20 },
  { id: 'kavanoor', name: 'Kavanoor', nameLocal: 'കാവനൂർ', coords: [76.064549, 11.194643], elevation: 36 },
  { id: 'areekode', name: 'Areekode', nameLocal: 'അരീക്കോട്', coords: [76.049183, 11.234559], elevation: 31 },
  { id: 'feroke', name: 'Feroke', nameLocal: 'ഫറോക്ക്', coords: [75.837537, 11.182545], elevation: 21 },
  { id: 'beypore', name: 'Beypore', nameLocal: 'ബേപ്പൂര്‍', coords: [75.810177, 11.179067], elevation: 13 },
  { id: 'chaliyam', name: 'Chaliyam', nameLocal: 'ചാലിയം', coords: [75.809522, 11.155958], elevation: 10 },
];

export const chaliyar: Journey = {
  id: 'chaliyar',
  bbox: [75.758017, 11.116596, 76.307595, 11.5571],
  route,
  markers,
  places,
  ribbon: {
    kind: 'river',
    /** Metres. A legibility figure. The Chaliyar is 100–300 m across its lower
     *  reaches and a few tens of metres up by Nilambur; one number cannot be
     *  both, and a true-width channel would vanish at the top of the run. */
    width: 90,
    lift: 1,
    tubeRadius: 45,
  },
  /**
   * Gentler than the ghat's ×2. This river falls 157 m in 105 km — it is
   * flat, and that flatness is the fact. Exaggerating it would manufacture
   * drama the water does not have.
   */
  verticalScale: { overview: 1.6, firstPerson: 1 },
  length: 105295,
  lowest: -2,
  highest: 155,
  /**
   * A wider, higher vantage than the ghat's.
   *
   * The defaults sit 760 m back and 620 m up — a 38° look-down, fine on a
   * mountainside where the camera is above everything nearby. Down here the
   * river runs in a shallow valley whose walls are a hundred metres away and
   * tens of metres high, and at 38° they hide the water completely. Higher and
   * further back clears them, and it suits the subject anyway: a river seen
   * from a light aircraft rather than from a following car.
   *
   * The long look-ahead is for the meanders. The Chaliyar doubles back on
   * itself constantly, and a short average would swing the camera on every one
   * of the hundreds of bends.
   */
  camera: {
    overviewBack: 1500,
    overviewHeight: 1900,
    overviewTarget: 600,
    overviewLookAhead: 1400,
    overviewClearance: 180,
  },
  palette: {
    /** Water, not tarmac. */
    surface: '#2a5f7a',
    edge: '#9fd4c8',
    /** The lower Chaliyar runs through coconut and paddy rather than the
     *  evergreen of the high ghat. */
    groundLow: '#6d8a4a',
    groundMid: '#3d6438',
  },
};

export { markers as towns, places };
export const riverLength = chaliyar.length;
export const source = {
  osmId: 'way/943346262',
  nameLocal: 'ചാലിയാർ നദി',
};
