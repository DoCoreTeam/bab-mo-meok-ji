// DOCORE: 음식 키워드 목록을 Supabase 데이터베이스에 다시 질입하는 스크립트

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Supabase URL or Service Role Key missing. Check your .env.local');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const foodList = [
  { kor_name: '곱창', type: 'alcohol' },
  { kor_name: '국밥', type: 'meal' },
  { kor_name: '삼겹살', type: 'meal' },
  { kor_name: '돈까스', type: 'meal' },
  { kor_name: '치킨', type: 'meal' },
  { kor_name: '햄버거', type: 'meal' },
  { kor_name: '피자', type: 'meal' },
  { kor_name: '샐러드', type: 'meal' },
  { kor_name: '파스타', type: 'meal' },
  { kor_name: '라멘', type: 'meal' },
  { kor_name: '초밥', type: 'meal' },
  { kor_name: '스테이크', type: 'meal' },
  { kor_name: '쌀국수', type: 'meal' },
  { kor_name: '카레', type: 'meal' },
  { kor_name: '순대국', type: 'meal' },
  { kor_name: '짜장면', type: 'meal' },
  { kor_name: '짬뽕', type: 'meal' },
  { kor_name: '냉면', type: 'meal' },
  { kor_name: '회', type: 'alcohol' },
  { kor_name: '회덮밥', type: 'meal' },
  { kor_name: '오므라이스', type: 'meal' },
  { kor_name: '닭갈비', type: 'meal' },
  { kor_name: '부대찌개', type: 'meal' },
  { kor_name: '감자탕', type: 'meal' },
  { kor_name: '양꼬치', type: 'alcohol' },
  { kor_name: '소바', type: 'meal' },
  { kor_name: '찜닭', type: 'meal' },
  { kor_name: '곰탕', type: 'meal' },
  { kor_name: '도삭면', type: 'meal' },
  { kor_name: '게장', type: 'alcohol' },
  { kor_name: '마라탕', type: 'meal' },
  { kor_name: '샤브샤브', type: 'meal' },
  { kor_name: '우동', type: 'meal' },
  { kor_name: '김밥', type: 'meal' },
  { kor_name: '고등어구이', type: 'alcohol' },
  { kor_name: '로스트치킨', type: 'meal' },
  { kor_name: '삼계탕', type: 'meal' },
  { kor_name: '도시락', type: 'meal' },
  { kor_name: '떡볶이', type: 'snack' },
  { kor_name: '핫도그', type: 'snack' },
  { kor_name: '타코', type: 'snack' },
  { kor_name: '스시롤', type: 'snack' },
  { kor_name: '로제파스타', type: 'snack' },
  { kor_name: '트러플피자', type: 'snack' },
  { kor_name: '문어숙회', type: 'alcohol' },
  { kor_name: '오코노미야끼', type: 'snack' },
  { kor_name: '푸팟퐁커리', type: 'snack' },
  { kor_name: '파닭', type: 'alcohol' },
  { kor_name: '족발', type: 'alcohol' },
  { kor_name: '막창', type: 'alcohol' },
  { kor_name: '새우구이', type: 'alcohol' },
  { kor_name: '닭발', type: 'alcohol' },
  { kor_name: '오징어숙회', type: 'alcohol' },
  { kor_name: '치즈플래터', type: 'alcohol' },
  { kor_name: '감바스', type: 'alcohol' },
  { kor_name: '호떡', type: 'snack' },
  { kor_name: '붕어빵', type: 'snack' },
  { kor_name: '샌드위치', type: 'snack' },
  { kor_name: '크레페', type: 'snack' },
  { kor_name: '핫바', type: 'snack' },
  { kor_name: '츄러스', type: 'snack' },
  { kor_name: '프레첼', type: 'snack' },
  { kor_name: '도넛', type: 'snack' },
  { kor_name: '마카롱', type: 'snack' },
  { kor_name: '타코야끼', type: 'snack' },
  { kor_name: '브런치', type: 'snack' },
  { kor_name: '과일 샐러드', type: 'snack' },
];

const slugify = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').toLowerCase();

const main = async () => {
  for (const food of foodList) {
    const engKeyword = slugify(food.kor_name);

    const { data, error: selectError } = await supabase
      .from('food_categories')
      .select('id')
      .eq('kor_name', food.kor_name)
      .maybeSingle();

    if (selectError) {
      console.error(`\u274c Select failed: ${food.kor_name}`, selectError.message);
      continue;
    }

    if (data) {
      console.log(`\u26a0\ufe0f Already exists: ${food.kor_name}`);
      continue;
    }

    const { error } = await supabase.from('food_categories').insert({
      kor_name: food.kor_name,
      eng_keyword: engKeyword,
      type: food.type,
      round: 1,
    });

    if (error) {
      console.error(`\u274c Insert failed: ${food.kor_name}`, error.message);
    } else {
      console.log(`\u2705 Inserted: ${food.kor_name} (${engKeyword})`);
    }
  }

  console.log('\ud83c\udf89 All done!');
};

main().catch(console.error);
