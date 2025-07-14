import { Container, Group, Text } from "@mantine/core";

export default function Footer() {
  return (
    <footer >
      <Container size="lg" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Text size="sm" c="dimmed">
          © {new Date().getFullYear()}
        </Text>
        <Group gap={8}>
          <Text size="sm" c="dimmed">
            <a href="https://github.com/zispace/ciku/" target="_blank" rel="noopener noreferrer">项目主页</a>
          </Text>
          <Text size="sm" c="dimmed">|</Text>
          <Text size="sm" c="dimmed">ZiSpace</Text>
        </Group>
      </Container>
    </footer>
  );
}
