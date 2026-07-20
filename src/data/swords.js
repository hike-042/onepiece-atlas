/* ============================================================
   SWORDS — named blades worth tracking on their own, since several
   pass between owners or carry their own reputation independent of
   whoever's currently wielding them.
   ============================================================ */

export const SWORDS = [
  { id:"wado-ichimonji", name:"Wado Ichimonji", grade:"Ō Wazamono (Great Grade)", currentOwner:"zoro",
    note:"Originally Kuina's sword, given to Zoro after her death as the anchor of the promise he carries for her." },
  { id:"sandai-kitetsu", name:"Sandai Kitetsu", grade:"Ō Wazamono (Great Grade)", currentOwner:"zoro",
    note:"One of the cursed Kitetsu blades, said to bring misfortune to any wielder who can't tame it." },
  { id:"shusui", name:"Shusui", grade:"Saijo O Wazamono (Supreme Grade)", currentOwner:"zoro",
    note:"A black blade forged in Wano, once belonging to the legendary swordsman Ryuma, later entrusted to Zoro." },
  { id:"enma", name:"Enma", grade:"Saijo O Wazamono (Supreme Grade)", currentOwner:"zoro",
    note:"One of Kozuki Oden's two legendary blades, said to be able to cut all the way to the underworld, currently on loan to Zoro from Momonosuke." },
  { id:"yoru", name:"Yoru", grade:"Saijo O Wazamono (Supreme Grade)", currentOwner:"mihawk",
    note:"A massive black greatsword, wielded by the man long considered the world's strongest swordsman." },
  { id:"ame-no-habakiri", name:"Ame no Habakiri", grade:"Saijo O Wazamono (Supreme Grade)", currentOwner:null,
    note:"Kozuki Oden's other legendary blade, said to be able to cut through the heavens themselves." },
];

export function swordsForCharacter(characterId){
  return SWORDS.filter(s => s.currentOwner === characterId);
}
