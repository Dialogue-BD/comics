export default {id:'kamille',name:'Kamille',topic:'Health',heading:'“Will AI help with quicker medical diagnosis?”',scenes:[
 {title:'So many fields',sub:'Where AI could be useful',bg:'bg1-fields',poses:[['explain']],
  fx:[['icon','check','specific',552,300,0],['icon','check','fields',800,280,0],['icon','check','would',1025,300,0],['icon','check','benefit',1186,306,0]],
  tags:[['specific fields','specific',690,150],['benefit','benefit',880,440,'mint']]},
 {at:['Will',1,-.2],title:'A quicker diagnosis?',sub:'AI and medicine',bg:'bg2-clinic',poses:[['ask']],
  fx:[['spark',[['AI',905,205],['diagnosis',905,290,1.25]]],['sun','help',.6]],
  tags:[['quicker','quicker',600,180],['medical diagnosis','medical',800,120,'teal']]},
 {at:["I'm",1,-.2],title:'Six years of waiting',sub:'Her own story',bg:'bg3-waiting',poses:[['weary']],init:[.9,.95],
  fx:[['tint','chronic',.6,.82],['shade','six',.7],['count','six',1,6,'years',[880,116],'clay',1.2]],
  tags:[['chronic illness','chronic',560,330,'clay'],['to figure out','figure',880,440,'gold']]},
 {at:['I',2,-.2],title:'What might have been',sub:'A different life',bg:'bg4-life',poses:[['wonder']],init:[.3,.82],
  fx:[['tint','positively',1.15,1.05,1.1],['sun','positively'],['spark',[[['AI',2],660,300],[['quicker',2],1049,300]]],['icon','check',['diagnosis',2],1170,200,0]],
  tags:[['my life','life',520,150],['positively','positively',760,230,'mint'],['quicker diagnosis',['quicker',2],860,440,'teal']]}
]};
