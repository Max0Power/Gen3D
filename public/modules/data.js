/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

"use strict"; 
// vanhoja african alueita:
var N00E006 = [0,1973];
var N00E009 = [-13,295];
var N00E010 = [1,1005];
var S01E006 = [0,94];
var S01E008 = [-11,40];
var S01E009 = [-21,332];
var S01E010 = [5,886];
// alppien alueen minimi ja maksimi korkeudet
var N41E008 = [-4,1443];
var N41E009 = [-5,2114];
var N41E011 = [-2,5];
var N41E012 = [-9,1368];
var N41E013 = [-11,2271];
var N41E014 = [-3,2181];
var N41E015 = [-14,1135];
var N41E016 = [-7,856];
var N42E008 = [-5,2653];
var N42E009 = [-7,2561];
var N42E010 = [-7,989];
var N42E011 = [-21,1723];
var N42E012 = [4,2194];
var N42E013 = [-4,2863];
var N42E014 = [-5,2777];
var N42E015 = [-1,113];
var N42E016 = [-4,554];
var N43E004 = [-16,465];
var N43E005 = [-10,1253];
var N43E006 = [-12,1923];
var N43E007 = [-11,2064];
var N43E008 = [-2,964];
var N43E009 = [-2,419];
var N43E010 = [-11,1289];
var N43E011 = [-23,1644];
var N43E012 = [-5,1690];
var N43E013 = [-28,1592];
var N43E015 = [-6,495];
var N43E016 = [-14,1886];
var N44E004 = [12,1737];
var N44E005 = [32,2757];
var N44E006 = [405,3952];
var N44E007 = [134,3760];
var N44E008 = [-10,1690];
var N44E009 = [-5,1833];
var N44E010 = [-9,2150];
var N44E011 = [-11,1305];
var N44E012 = [-17,669];
var N44E013 = [-5,252];
var N44E014 = [-7,1654];
var N44E015 = [-43,1743];
var N44E016 = [81,1947];
var N45E004 = [108,1426];
var N45E005 = [134,2894];
var N45E006 = [236,4672];
var N45E007 = [156,4530];
var N45E008 = [32,2870];
var N45E009 = [22,2600];
var N45E010 = [-10,2793];
var N45E011 = [-7,2312];
var N45E012 = [-26,1549];
var N45E013 = [-32,1474];
var N45E014 = [-8,1778];
var N45E015 = [92,1287];
var N45E016 = [66,872];
var N46E004 = [120,1005];
var N46E005 = [157,1707];
var N46E006 = [341,3145];
var N46E007 = [399,4420];
var N46E008 = [191,4162];
var N46E009 = [192,3940];
var N46E010 = [117,3865];
var N46E011 = [160,3460];
var N46E012 = [21,3256];
var N46E013 = [58,3036];
var N46E014 = [213,2458];
var N46E015 = [134,1956];
var N46E016 = [106,1054];
var N47E004 = [132,864];
var N47E005 = [167,641];
var N47E006 = [200,1426];
var N47E007 = [178,1597];
var N47E008 = [289,2854];
var N47E009 = [388,2938];
var N47E010 = [569,3370];
var N47E011 = [473,3461];
var N47E012 = [377,3666];
var N47E013 = [391,3328];
var N47E014 = [295,2568];
var N47E015 = [261,2262];
var N47E016 = [103,1317];
var N48E004 = [71,398];
var N48E005 = [139,509];
var N48E006 = [166,1345];
var N48E007 = [103,1350];
var N48E008 = [85,1232];
var N48E009 = [173,977];
var N48E010 = [368,745];
var N48E011 = [330,721];
var N48E012 = [295,1092];
var N48E013 = [252,1441];
var N48E014 = [223,1235];
var N48E015 = [170,1099];
var N48E016 = [131,834];
// cornwall rannikko alue, brittejen saari
var N49W006 = [-3,89];
var N50W004 = [-34,602];
var N50W005 = [-35,615];
var N50W006 = [-5,249];
var N51W004 = [-23,873];
var N51W005 = [-6,529];
// Denali, Pohjois Amerikan korkein vuori
var N62W151 = [52,3712];
var N62W152 = [37,5287];
var N63W151 = [148,6115];
var N63W152 = [157,6188];
// Faroe Islands, Englannin ylapuolella, sielta loytyy suuret jyrkanteet
var N61W007 = [0,600];
var N61W008 = [0,447];
var N62W007 = [0,840];
var N62W008 = [0,880];
// grand canyonin alueen min ja max korkeudet
var N34W111 = [1331,2417];
var N34W112 = [596,2595];
var N34W113 = [531,2422];
var N34W114 = [155,2292];
var N34W115 = [91,1609];
var N35W111 = [1425,2194];
var N35W112 = [1187,3825];
var N35W113 = [1338,2856];
var N35W114 = [373,2533];
var N35W115 = [138,2151];
var N36W111 = [1310,2491];
var N36W112 = [777,2722];
var N36W113 = [584,2812];
var N36W114 = [366,2448];
var N36W115 = [206,2434];
var N37W111 = [1092,3463];
var N37W112 = [1079,3299];
var N37W113 = [1167,3444];
var N37W114 = [664,3157];
var N37W115 = [663,2845];
var N38W111 = [1116,3502];
var N38W112 = [1392,3541];
var N38W113 = [1413,3701];
var N38W114 = [1350,2962];
var N38W115 = [1467,3959];
// Haltin aluetta
var N68E020 = [324,1463];
var N68E021 = [335,952];
var N69E020 = [0,1584];
var N69E021 = [0,1362];
// kebnekaise, Ruotsin korkein vuori
var N67E017 = [382,2079];
var N67E018 = [368,2104];
var N68E017 = [0,1861];
var N68E018 = [8,1981];
// Manhattanin aluetta, new york, Usa
var N40W073 = [-35,89];
var N40W074 = [-42,179];
var N40W075 = [-86,404];
// mount everestin min max korkeudet
var N27E086 = [192,8642];
var N27E087 = [179,7270];
var N27E088 = [185,8231];
var N28E086 = [2623,8265];
var N28E087 = [3134,6766];
var N28E088 = [4005,6774];
var N29E086 = [4114,6386];
var N29E087 = [3925,6145];
var N29E088 = [3818,6268];
// Mount Fuji, Japani
var N35E138 = [-16,3742];
// mount kilimanjaron alueen min ja max korkeudet
var S02E035 = [818,2678];
var S02E036 = [585,2578];
var S02E037 = [784,2152];
var S02E038 = [273,1646];
var S03E035 = [577,3249];
var S03E036 = [582,2938];
var S03E037 = [704,3980];
var S03E038 = [236,1654];
var S04E035 = [825,3645];
var S04E036 = [698,4524];
var S04E037 = [640,5880];
var S04E038 = [201,2198];
var S05E035 = [997,3389];
var S05E036 = [1010,2169];
var S05E037 = [524,2454];
var S05E038 = [64,2294];
// Mount Roraima, vuori Brasilian, Guyanan ja Venezuelan rajalla
var N05W061 = [81,2461];
// Preikestolen alue Norjassa
var N58E006 = [-20,1197];