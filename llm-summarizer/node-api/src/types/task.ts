//define a interface pra ser usada. 
//usar 'lang' como tipo já garante que não passa uma linguagem errada

export interface Task {
    id: string;
    text: string;
    summary: string;
    lang: 'pt' | 'en' | 'es';
}
