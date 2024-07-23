import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // 공구템 작성
  const formData = await request.formData();
  const newGroupImage: any = formData.get("file");
  try {
    const supabase = createClient();
    const { data } = await supabase.storage
      .from("groupposts")
      .upload(`grouppost_${Date.now()}.png`, newGroupImage);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "데이터를 등록하는 데 실패했습니다." });
  }
}