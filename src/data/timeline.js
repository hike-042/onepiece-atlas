/* ============================================================
   TIMELINE — sagas in story order, with rough real-world publication
   windows. Chapter ranges are approximate and meant as orientation,
   not a precise citation — update them as arcs conclude.
   ============================================================ */

export const TIMELINE = [
  { id:"east-blue", saga:"East Blue Saga", chapterRange:"1–100", yearsPublished:"1997–1998", keyLocations:["foosha","shells","orange","syrup","baratie","arlong","loguetown"] },
  { id:"alabasta-saga", saga:"Alabasta Saga", chapterRange:"101–217", yearsPublished:"1998–2002", keyLocations:["reverse","whiskypeak","littlegarden","drum","alabasta"] },
  { id:"sky-island", saga:"Sky Island Saga", chapterRange:"218–302", yearsPublished:"2002–2003", keyLocations:["jaya","skypiea"] },
  { id:"water-7-saga", saga:"Water 7 Saga", chapterRange:"303–441", yearsPublished:"2003–2006", keyLocations:["longring","waterseven","enieslobby","merryfuneral"] },
  { id:"thriller-bark", saga:"Thriller Bark Saga", chapterRange:"442–489", yearsPublished:"2007", keyLocations:["thrillerbark"] },
  { id:"summit-war", saga:"Summit War Saga", chapterRange:"490–580", yearsPublished:"2008–2010", keyLocations:["sabaody","amazonlily","impeldown","marineford"] },
  { id:"fishman-island", saga:"Fish-Man Island Saga", chapterRange:"581–653", yearsPublished:"2010–2011", keyLocations:["fishmanisland"] },
  { id:"dressrosa-saga", saga:"Dressrosa Saga", chapterRange:"654–801", yearsPublished:"2012–2015", keyLocations:["punkhazard","dressrosa"] },
  { id:"four-emperors", saga:"Four Emperors Saga", chapterRange:"802–908", yearsPublished:"2015–2018", keyLocations:["zou","wholecake","wano"] },
  { id:"final-saga", saga:"Final Saga", chapterRange:"1053–present", yearsPublished:"2022–present", keyLocations:["egghead","elbaf","laughtale"] },
];

export function sagaForChapter(chapterNumber){
  return TIMELINE.find((s, i) => {
    const [start] = s.chapterRange.split(/[–-]/).map(n => parseInt(n, 10));
    const next = TIMELINE[i + 1];
    const nextStart = next ? parseInt(next.chapterRange.split(/[–-]/)[0], 10) : Infinity;
    return chapterNumber >= start && chapterNumber < nextStart;
  }) || null;
}
