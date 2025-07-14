 "use client";
import { Group, ActionIcon, Container, Text } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useMantineColorScheme } from "@mantine/core";

export default function HeaderNav() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <header>
      <Container size="lg" px="md" py={8} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Text fw={700} size="lg">输入法词库转换</Text>
        <Group>
          <ActionIcon variant="subtle" size="lg" onClick={toggleColorScheme} title="切换明暗模式">
            {colorScheme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
          </ActionIcon>
        </Group>
      </Container>
    </header>
  );
}
