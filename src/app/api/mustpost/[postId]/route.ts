import { createClient } from "@/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { postId: string } }) {
  //상세 가져오기
  const { postId } = params;
  const supabase = createClient();
  try {
    const { data } = await supabase.from("must_posts").select(`*, must_categories(id, name)`).eq("id", postId).single();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "포스트를 가져오는 데 실패했습니다." });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const editMustPost = await request.json();
  try {
    const supabase = createClient();
    const { data } = await supabase.from("must_posts").update(editMustPost);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "데이터를 등록하는 데 실패했습니다." });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { postId: string } }) {
  const { postId } = params;
  //삭제
  try {
    const supabase = createClient();
    const { data } = await supabase.from("must_posts").delete().eq("id", postId);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "포스트를 삭제하는 데 실패했습니다." });
  }
}
