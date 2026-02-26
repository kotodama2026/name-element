import { ElementType, ElementData, CharacterDetail, KotodamaCharData } from '../types';

export const ELEMENTS_CONFIG: Record<ElementType, ElementData> = {
  [ElementType.FIRE]: {
    type: ElementType.FIRE,
    color: 'text-rose-400',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-600',
    gradient: 'from-rose-400 to-rose-600',
    icon: '🔥',
    description: '情熱的・直感的',
    hexColor: '#e11d48',
  },
  [ElementType.WATER]: {
    type: ElementType.WATER,
    color: 'text-sky-400',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-600',
    gradient: 'from-sky-400 to-sky-600',
    icon: '💧',
    description: '柔軟的・感受性',
    hexColor: '#0284c7',
  },
  [ElementType.WIND]: {
    type: ElementType.WIND,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
    gradient: 'from-yellow-400 to-yellow-600',
    icon: '🍃',
    description: '軽やか・社交的',
    hexColor: '#facc15',
  },
  [ElementType.EARTH]: {
    type: ElementType.EARTH,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-600',
    gradient: 'from-emerald-400 to-emerald-600',
    icon: '⛰️',
    description: '誠実的・安定的',
    hexColor: '#059669',
  },
  [ElementType.VOID]: {
    type: ElementType.VOID,
    color: 'text-purple-400',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600',
    gradient: 'from-purple-400 to-purple-600',
    icon: '✨',
    description: '神秘的・独創的',
    hexColor: '#9333ea',
  },
};

const CHAR_DATA: Record<string, KotodamaCharData> = {
  'あ': { element: ElementType.FIRE, value: 5, symbol: '天の岩戸開き', image: '新しい希望', keyword: 'イチからはじめる、未知の可能性、行動する。注意点：自分一人で抱え込みがち。開運：周りの人に助けを求めること' },
  'い': { element: ElementType.FIRE, value: 3, symbol: '3歳の子ども', image: '永遠の3歳児', keyword: '純粋、好きなことを楽しむ、無理な我慢をしない。注意点：飽きっぽさ、わがまま。開運：ワクワクすることを最優先にすること' },
  'う': { element: ElementType.EARTH, value: 3, symbol: '青い梅', image: '時間をかける', keyword: 'ゆっくりと進める、あせらない、過去の経験を活かす。注意点：慎重になりすぎること。開運：一歩ずつ着実に進むこと' },
  'え': { element: ElementType.FIRE, value: 4, symbol: '枝', image: '自分の行きたいほうに行く', keyword: '栄光、自信をもって行動する、遠慮せずに受け取る。注意点：プライドの高さ。開運：自分の感性を信じること' },
  'お': { element: ElementType.EARTH, value: 5, symbol: 'お地蔵さん', image: '影の実力者', keyword: '落ち着いて考える、優しさ、包容力。注意点：消極的になりがち。開運：自分の考えを言葉にしてみること' },
  'か': { element: ElementType.FIRE, value: 5, symbol: '刀', image: '可能性を切り開く', keyword: '決断力がある、向上心が強い、熱血、頭の回転が速い、理想が高い。注意点：感情のコントロール、スピードが速すぎる。開運：今の自分を認めること' },
  'き': { element: ElementType.WIND, value: 3, symbol: '木', image: '時間をかけて成長する', keyword: '勉強家、自己流、知的好奇心、几帳面、質問好き、空気を察する。注意点：生真面目、傷つきやすい、気が散る。開運：学んだ知識を人にシェアすること' },
  'く': { element: ElementType.EARTH, value: 4, symbol: '井戸', image: '情報をためて活かす', keyword: '研究家、観察力、分析が得意、想いをくみ取る、優秀なサポーター。注意点：我慢しがち、リスク回避。開運：繊細な感性を大切にすること' },
  'け': { element: ElementType.FIRE, value: 4, symbol: '御饌（みけ）', image: '神様の食べ物', keyword: '面倒見が良い、社交上手、人を楽しませる、世話好き、気取らない。注意点：負けず嫌い、評判に敏感、話が脱線しがち。開運：周りへの気配りを忘れないこと' },
  'こ': { element: ElementType.EARTH, value: 4, symbol: '米', image: '手間ひまをかける', keyword: '謙虚、粘り強い、守りが得意、大器晩成、協力できる。注意点：行動が消極的、感情を表に出すのが苦手。開運：自分の努力を自分で認めてあげること' },
  'さ': { element: ElementType.FIRE, value: 5, symbol: '酒', image: 'さっさと幸せになる', keyword: '単独行動が得意、束縛が嫌い、さっぱり・サバサバ、手際が良い、楽しいことだけしていたい。注意点：熱しやすく冷めやすい、じっくり掘り下げるのが苦手。開運：周りの人に感謝の気持ちを伝えること' },
  'し': { element: ElementType.WIND, value: 5, symbol: '塩', image: 'バランスを整える', keyword: '段取りが上手、交渉がうまい、コスパ重視、論理的、まとめ役。注意点：冷たく思われる、問題を解決しないと気が済まない。開運：カッコ悪い、泥臭いことも選択してみること' },
  'す': { element: ElementType.VOID, value: 5, symbol: '鈴', image: '浄化してスッキリ', keyword: '感性が鋭い、融通がきく、自発的、流行に敏感、柔軟性がある。注意点：こだわりがない、飽きっぽい、自分らしさがなくなる。開運：ひとつ・ひとつをカタチにしていくこと' },
  'せ': { element: ElementType.WIND, value: 4, symbol: '瀬', image: '勢いに乗って突き進む', keyword: '正義感が強い、パワーと勢いがある、集中して取り組む、短期決戦、度胸がある。注意点：急な方向転換が苦手、せっかち。開運：ひとつのことに集中すること' },
  'そ': { element: ElementType.WIND, value: 3, symbol: '基礎', image: '縁の下の力持ち', keyword: '現実的、統率力がある、根拠をもとに動く、組織的、大器晩成。注意点：ノリで動けない、本音が言えない、空虚感。開運：大志を持つこと' },
  'た': { element: ElementType.FIRE, value: 5, symbol: '竹', image: '勢いがあり成長する', keyword: '精神力が強い、タフ、努力家、積極的、実用性重視。注意点：人に任せられない、器用貧乏になりがち。開運：やりたいことを先延ばしにせず取り組むこと' },
  'ち': { element: ElementType.FIRE, value: 2, symbol: '千手観音', image: '手を差し伸べる', keyword: '気が付く、世話好き、与えるのが好き、感情を大切にする、一途。注意点：尽くしすぎる、客観的になれない、見返りを求める。開運：自分自身を大切にすること' },
  'つ': { element: ElementType.EARTH, value: 3, symbol: '都', image: '人や物をひきつける', keyword: '突き詰める、つなぐ、知識豊富、勉強好き、没頭する。注意点：内にこもる、柔軟性がない、アドバイスを聞かない。開運：人とのつながりを大切にすること' },
  'て': { element: ElementType.EARTH, value: 4, symbol: '手', image: '職人気質', keyword: '職人気質、芯が強い、独自の世界観、徹底的、行動で示す。注意点：頑固、こだわりが強い、ワイワイするのが苦手。開運：人の意見も取り入れてみること' },
  'と': { element: ElementType.EARTH, value: 5, symbol: '鳥居', image: 'とりまとめ役', keyword: '俯瞰、バランス、信頼される、公平、責任感。注意点：決断に時間がかかる、失敗を恐れる、人間関係がおろそかになる。開運：身近な人を大切にすること' },
  'な': { element: ElementType.FIRE, value: 1, symbol: '七重の塔', image: '完璧を目指す', keyword: '完璧主義、繊細、理想が高い、秘密を守る、責任感が強い。注意点：抱え込みがち、傷つきやすい、警戒心が強い。開運：意地を張らずに素直になること' },
  'に': { element: ElementType.EARTH, value: 4, symbol: 'にぼし', image: '噛めば噛むほど味がでる', keyword: '独創的、人情味、マイペース、自分らしさ、ユーモア。注意点：世の中の決まり事は後回し、グループ行動が苦手。開運：一人の時間を大切にすること' },
  'ぬ': { element: ElementType.EARTH, value: 3, symbol: 'ぬか漬け', image: '手間と愛情をかける', keyword: '計画性、初志貫徹、ぬくもり、堅実、忍耐力。注意点：恥ずかしがり屋、新しい発想が苦手、なじむのに時間がかかる。開運：同じことをやり続けること' },
  'ね': { element: ElementType.WATER, value: 4, symbol: '根', image: '見えない大切な役割', keyword: '察する能力、根回し上手、気配り、平和主義、お願い上手。注意点：ひとりで最後までやらない、他人の目を気にする、本音を言わない。開運：自力で限界まで頑張ってみること' },
  'の': { element: ElementType.EARTH, value: 5, symbol: '巻物', image: 'マイルール', keyword: 'のんびり、マイルール、人のマネをしない、観察力、分析力。注意点：主観が強い、即断即決が苦手、突然毒舌になる。開運：自分らしさを小出しにすること' },
  'は': { element: ElementType.FIRE, value: 4, symbol: '羽', image: '軽快に飛び回る', keyword: '癒し系、天然、楽天的、自然体、愛されキャラ。注意点：問題先送り、おっちょこちょい、ルールが苦手。開運：自然体でいられる環境にいること' },
  'ひ': { element: ElementType.FIRE, value: 5, symbol: '太陽', image: '自ら光を放つ', keyword: '仲間を大切にする、リーダー気質、面倒見が良い、行動力、社交的。注意点：否定に弱い、強引、気分屋。開運：これは『誰にも負けない』と自分自身で思えるものを持つこと' },
  'ふ': { element: ElementType.VOID, value: 5, symbol: 'かざぐるま', image: '柔軟に対応する', keyword: '度量が広い、サポート、空気を読む、臨機応変、頭が柔らかい。注意点：事なかれ主義、つかみどころがない。開運：自分の意見をハッキリ言ってみること' },
  'へ': { element: ElementType.FIRE, value: 2, symbol: 'へり', image: '自ら舵を取る', keyword: '独創的、行動力、意志が強い、改善策を考える、へこたれない。注意点：グループ行動が苦手、天邪鬼、口だけになりがち。開運：意地にならず、素直になること' },
  'ほ': { element: ElementType.WATER, value: 3, symbol: '日本茶', image: 'ほっと一息', keyword: '気遣い上手、精神年齢が高い、調和、包容力、ムードメーカー。注意点：感情を抑える、感情移入しすぎ、頑固。開運：普段から、意見を小出しにしていくこと' },
  'ま': { element: ElementType.FIRE, value: 4, symbol: '鏡', image: '真実と向き合う', keyword: 'まっすぐ、学びが好き、実務能力が高い、正義感、理想が高い。注意点：いい加減な人が許せない、頑張りすぎ、白黒つけたがる。開運：「負けるが勝ち」の姿勢を身につけること' },
  'み': { element: ElementType.VOID, value: 5, symbol: '水', image: '柔軟な流れ', keyword: '柔軟性が高い、流れを読む、ムードメーカー、浄化力、寄り添う。注意点：流されやすい、優憂不断、意地っ張り。開運：たまには自分が主役になってみること' },
  'む': { element: ElementType.EARTH, value: 4, symbol: 'おむすび', image: '新しい価値を結ぶ', keyword: '哲学者、本質探求、一点集中、考えるのが好き、精神的成長。注意点：殻にとじこもる、本心を言わない、抱え込む。開運：『まず、やってみる』を意識すること' },
  'め': { element: ElementType.WIND, value: 2, symbol: '芽', image: '新しい可能性', keyword: '気配り上手、洞察力、客観的、冷静、分析が得意。注意点：八方美人、発言しない、無理して付き合う。開運：人の誘いにのってみること' },
  'も': { element: ElementType.EARTH, value: 5, symbol: '餅', image: '腰がすわっている', keyword: '面倒見が良い、粘り強い、責任感、計画的、信頼される。注意点：甘え下手、自己犠牲、おせっかい。開運：たまには、人に甘えてみること' },
  'や': { element: ElementType.FIRE, value: 4, symbol: '矢', image: 'まっすぐ突き進む', keyword: '思い切りがいい、好奇心旺盛、ストレート、感性豊か、潔い。注意点：深く考えない、無関心、飽きっぽい。開運：進む方向を決めること' },
  'ゆ': { element: ElementType.EARTH, value: 2, symbol: '弓', image: 'エネルギーをためて放つ', keyword: '秘めた情熱、想像力豊か、やり抜く、大器晩成、粘り強い。注意点：人の意見を聞かない、突発的なことが苦手、行動に移せない。開運：マイペースを保つこと' },
  'よ': { element: ElementType.EARTH, value: 5, symbol: '夜', image: '準備期間', keyword: '現実的、責任感、丁寧、信用、安定志向。注意点：考えすぎる、冒険できない、防衛心が強い。開運：『まず、やってみる』を意識すること' },
  'ら': { element: ElementType.FIRE, value: 5, symbol: 'らくだ', image: 'タフで楽天的', keyword: '楽天的、明るい、パワフル、切り替えが早い、行動力。注意点：計画が苦手、すぐ忘れる、鵜呑みにする。開運：表面的なことに惑わされないこと' },
  'り': { element: ElementType.FIRE, value: 4, symbol: 'あめのうずめのみこと', image: '芸術的センス', keyword: 'アーティスト気質、負けず嫌い、感性が鋭い、個性的、自由。注意点：協調性がない、勝手に行動する、周囲を振り回す。開運：人とのご縁を大切にすること' },
  'る': { element: ElementType.EARTH, value: 2, symbol: 'のり巻き', image: '周りを巻き込む', keyword: 'サービス精神、人脈、好奇心、情報収集、フットワークが軽い。注意点：気分屋、計画倒れ、地味な作業が苦手。開運：考えたことを書き出してみること' },
  'れ': { element: ElementType.WIND, value: 4, symbol: 'くじゃく', image: '優雅さと洗練', keyword: '華がある、冷静、頭の回転が速い、分析力、洗練。注意点：継続が苦手、面倒なことを避ける、干渉を嫌う。開運：地味な作業をきちんとすること' },
  'ろ': { element: ElementType.WIND, value: 3, symbol: 'どんぶりめし', image: '器が大きい', keyword: 'おおらか、情熱家、親しみやすい、ポジティブ、どんぶり勘定。注意点：継続が苦手、面倒なことを避ける、干渉を嫌う。開運：繊細さも大切にすること' },
  'わ': { element: ElementType.WATER, value: 5, symbol: '勾玉', image: '調和と統合', keyword: 'マイペース、調和、平和主義、調整能力、視野が広い。注意点：あわせすぎる、意見を通せない、指摘できない。開運：人と違う意見でも、主張してみること' },
  'を': { element: ElementType.EARTH, value: 1, symbol: '結び目', image: '過去と現代をつなぐ', keyword: '根気強い、理想追求、こだわり、緻密、集中力。注意点：マルチタスク苦手、過集中、頑固。開運：全く違う分野の人と交流してみること' },
  'ん': { element: ElementType.WIND, value: 1, symbol: 'お侍さん', image: '公に尽くす', keyword: '社交家、責任感、人懐っこい、人当たりが良い、貢献好き。注意点：他人の目を気にする、自己犠牲、無価値感。開運：自分の得意分野を伸ばしていくこと' },
  'ー': { element: ElementType.VOID, value: 1, symbol: 'ー', image: 'ー', keyword: 'ー' },
};

const normalizeChar = (char: string): {
  baseChar: string;
  adjustment: number;
  isVoiced: boolean;
  isSemiVoiced: boolean;
  isSmall: boolean;
} => {
  const dakutenMap: Record<string, string> = {
    'が': 'か', 'ぎ': 'き', 'ぐ': 'く', 'げ': 'け', 'ご': 'こ',
    'ざ': 'さ', 'じ': 'し', 'ず': 'す', 'ぜ': 'せ', 'ぞ': 'そ',
    'だ': 'た', 'ぢ': 'ち', 'づ': 'つ', 'で': 'て', 'ど': 'と',
    'ば': 'は', 'び': 'ひ', 'ぶ': 'ふ', 'べ': 'へ', 'ぼ': 'ほ',
    'ゔ': 'う'
  };
  const handakutenMap: Record<string, string> = {
    'ぱ': 'は', 'ぴ': 'ひ', 'ぷ': 'ふ', 'ぺ': 'へ', 'ぽ': 'ほ'
  };
  const smallMap: Record<string, string> = {
    'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お',
    'っ': 'つ', 'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ', 'ゎ': 'わ'
  };

  if (dakutenMap[char]) return { baseChar: dakutenMap[char], adjustment: 1, isVoiced: true, isSemiVoiced: false, isSmall: false };
  if (handakutenMap[char]) return { baseChar: handakutenMap[char], adjustment: -1, isVoiced: false, isSemiVoiced: true, isSmall: false };
  if (smallMap[char]) return { baseChar: smallMap[char], adjustment: -1, isVoiced: false, isSemiVoiced: false, isSmall: true };

  return { baseChar: char, adjustment: 0, isVoiced: false, isSemiVoiced: false, isSmall: false };
};

export const calculateScores = (lastName: string, firstName: string): {
  details: CharacterDetail[],
  lastNameScores: Record<ElementType, number>,
  firstNameScores: Record<ElementType, number>
} => {
  const details: CharacterDetail[] = [];

  const getInitialScores = (): Record<ElementType, number> => ({
    [ElementType.FIRE]: 0, [ElementType.WATER]: 0, [ElementType.WIND]: 0, [ElementType.EARTH]: 0, [ElementType.VOID]: 0,
  });

  const lastNameScores = getInitialScores();
  const firstNameScores = getInitialScores();

  const processPart = (partName: string, scoresObj: Record<ElementType, number>) => {
    const chars = Array.from(partName);
    chars.forEach((char, index) => {
      const { baseChar, adjustment } = normalizeChar(char);
      const data = CHAR_DATA[baseChar] || { element: ElementType.VOID, value: 1, symbol: '', image: '', keyword: '' };
      const { element, value: soundValue } = data;
      let baseMultiplier = index < 4 ? 5 - index : 1;
      const finalMultiplier = baseMultiplier + adjustment;
      const totalValue = Math.max(0, finalMultiplier * soundValue);

      details.push({
        char, baseChar, element, soundValue, baseMultiplier, adjustment, totalValue,
        ...data
      });
      scoresObj[element] += totalValue;
    });
  };

  if (lastName) processPart(lastName, lastNameScores);
  if (firstName) processPart(firstName, firstNameScores);

  return { details, lastNameScores, firstNameScores };
};

export const determinePrimaryElement = (lastNameScores: Record<ElementType, number>, firstNameScores: Record<ElementType, number>): ElementType => {
  const elements = [ElementType.FIRE, ElementType.WATER, ElementType.WIND, ElementType.EARTH, ElementType.VOID];

  const combinedScores: Record<ElementType, number> = {
    [ElementType.FIRE]: lastNameScores[ElementType.FIRE] + firstNameScores[ElementType.FIRE],
    [ElementType.WATER]: lastNameScores[ElementType.WATER] + firstNameScores[ElementType.WATER],
    [ElementType.WIND]: lastNameScores[ElementType.WIND] + firstNameScores[ElementType.WIND],
    [ElementType.EARTH]: lastNameScores[ElementType.EARTH] + firstNameScores[ElementType.EARTH],
    [ElementType.VOID]: lastNameScores[ElementType.VOID] + firstNameScores[ElementType.VOID],
  };

  const maxScore = Math.max(...elements.map(el => combinedScores[el]));
  const winners = elements.filter(el => combinedScores[el] === maxScore);
  return winners[0];
};