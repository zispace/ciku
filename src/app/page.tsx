"use client";
import { ActionIcon, Button, Card, Container, Divider, FileButton, Group, Notification, ScrollArea, Select, Stack, Table, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconDownload, IconFileText, IconRefresh, IconTable, IconUpload } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import Footer from "../components/Footer";
import HeaderNav from "../components/HeaderNav";
import { getAllSupportedExtensions, parseByExtension } from "../parsers";

const ACCEPT_EXTENSIONS = getAllSupportedExtensions().join(",");

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [words, setWords] = useState<Array<{ word: string; pinyin?: string; weight?: number }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rowLimit, setRowLimit] = useState<string>("100");
  const [sortBy, setSortBy] = useState<string>("index");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [fileInputKey, setFileInputKey] = useState(0);

  // 排序后的数据
  const sortedWords = useMemo(() => {
    const arr = rowLimit === "全部" ? words : words.slice(0, Number(rowLimit));
    if (sortBy === "index") {
      return arr;
    }
    return [...arr].sort((a, b) => {
      const va = a[sortBy as keyof typeof a];
      const vb = b[sortBy as keyof typeof b];
      if (typeof va === "string" && typeof vb === "string") {
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va;
      }
      return 0;
    });
  }, [words, rowLimit, sortBy, sortDir]);

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  const handleFileChange = async (f: File | null) => {
    if (!f) return;
    setFile(f);
    setWords([]);
    setError(null);
    setLoading(true);
    console.log("handleFileChange", f);
    try {
      const result = await parseByExtension(f);
      setWords(result);
    } catch (e: any) {
      setError(e.message || "解析失败");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!file || words.length === 0) return;
    // 生成TSV内容
    const tsv = words.map(w => [w.word, w.pinyin ?? "", w.weight ?? ""].join("\t")).join("\n");
    // 生成文件名
    const base = file.name.replace(/\.[^.]+$/, "");
    const filename = base + ".tsv";
    // 触发下载
    const blob = new Blob([tsv], { type: "text/tab-separated-values" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  const handleClear = () => {
    setWords([]);
    setFile(null);
    setFileInputKey(k => k + 1); // 关键：强制重置 FileButton，允许同一文件重复打开
  };

  return (
    <>
      <HeaderNav />
      <Container size="md" py="xl">
        <Stack gap="xl">
          {/* 上传卡片 */}
          <Card shadow="sm" radius="lg" p="lg" withBorder>
            <Group justify="space-between" align="center">
              <Group>
                <IconFileText size={28} />
                <Title order={4}>
                  上传文件
                  <Text span size="xs" c="dimmed" ml={8} style={{ textDecoration: 'underline dotted', cursor: 'pointer' }}>
                    (目前支持: {ACCEPT_EXTENSIONS})
                  </Text>
                </Title>
              </Group>
              <FileButton
                key={fileInputKey}
                onChange={handleFileChange}
                accept={ACCEPT_EXTENSIONS}
                disabled={loading}
              >
                {(props) => (
                  <Button leftSection={<IconUpload size={18} />} variant="light" loading={loading} {...props}>
                    选择文件
                  </Button>
                )}
              </FileButton>
            </Group>
            {file && (
              <Text mt="md" size="sm" c="dimmed">
                已选择文件：{file.name}（{Math.round(file.size / 1024)} KB）
              </Text>
            )}
            {error && (
              <div style={{ marginTop: 16 }}>
                <Notification color="red" icon={<IconAlertCircle size={18} />}>
                  {error}
                </Notification>
              </div>
            )}
          </Card>

          {/* 导出操作区 */}
          <Card shadow="sm" radius="lg" p="lg" withBorder>
            <Group justify="space-between" align="center">
              <Group>
                <IconDownload size={24} />
                <Title order={4}>导出词库</Title>
              </Group>
              <Button leftSection={<IconDownload size={18} />} onClick={handleExport} disabled={words.length === 0}>
                保存为TSV
              </Button>
            </Group>
          </Card>

          {/* 解析展示区 */}
          <Card shadow="sm" radius="lg" p="lg" withBorder>
            <Group justify="space-between" align="center" mb="md">
              <Group>
                <Group>
                  <IconTable size={24} />
                  <Title order={4}>词条预览</Title>
                </Group>
                <Text size="sm" c="dimmed" ml={8}>
                  {words.length > 0 && `（共 ${words.length} 条）`}
                </Text>
              </Group>
              <Group>
                <Select
                  data={["50", "100", "200", "500", "1000", "全部"]}
                  value={rowLimit}
                  onChange={v => setRowLimit(v || "100")}
                  size="xs"
                  w={100}
                  allowDeselect={false}
                  label="显示行数"
                  placeholder="显示行数"
                />
                <ActionIcon variant="subtle" size="lg" onClick={handleClear} title="清空">
                  <IconRefresh size={20} />
                </ActionIcon>
              </Group>
            </Group>
            <Divider mb="sm" />
            <ScrollArea h={400} type="auto" offsetScrollbars>
              <Table striped highlightOnHover withTableBorder stickyHeader>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>
                      序号
                    </Table.Th>
                    <Table.Th onClick={() => handleSort("word")} style={{ cursor: "pointer" }}>
                      词语{sortBy === "word" && (sortDir === "asc" ? " ▲" : " ▼")}
                    </Table.Th>
                    <Table.Th onClick={() => handleSort("pinyin")} style={{ cursor: "pointer" }}>
                      拼音{sortBy === "pinyin" && (sortDir === "asc" ? " ▲" : " ▼")}
                    </Table.Th>
                    <Table.Th onClick={() => handleSort("weight")} style={{ cursor: "pointer" }}>
                      权重{sortBy === "weight" && (sortDir === "asc" ? " ▲" : " ▼")}
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {loading ? (
                    <Table.Tr>
                      <Table.Td colSpan={4} style={{ textAlign: "center", color: "#aaa" }}>
                        正在解析...
                      </Table.Td>
                    </Table.Tr>
                  ) : words.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={4} style={{ textAlign: "center", color: "#aaa" }}>
                        暂无数据，请上传词库文件
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    sortedWords.map((w, i) => (
                      <Table.Tr key={i}>
                        <Table.Td>{i + 1}</Table.Td>
                        <Table.Td>{w.word}</Table.Td>
                        <Table.Td>{w.pinyin || "-"}</Table.Td>
                        <Table.Td>{w.weight ?? "-"}</Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Card>

        </Stack>
      </Container>
      <Footer />
    </>
  );
}
