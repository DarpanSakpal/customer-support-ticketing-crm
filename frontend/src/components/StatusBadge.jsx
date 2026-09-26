function StatusBadge({ status }) {
  const styles = {
    Open: {
      wrapper:
        "border-[#93b4ff] bg-[#e8f0ff] text-[#1746a2]",
      dot: "bg-[#2167f5]",
    },

    "In Progress": {
      wrapper:
        "border-[#e8b84a] bg-[#fff5d9] text-[#8a5a00]",
      dot: "bg-[#d99000]",
    },

    Closed: {
      wrapper:
        "border-[#79c99a] bg-[#e4f7eb] text-[#176b3a]",
      dot: "bg-[#1ca65a]",
    },
  };

  const current = styles[status] || {
    wrapper:
      "border-[#b8c2d1] bg-[#f1f4f8] text-[#475569]",
    dot: "bg-[#64748b]",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${current.wrapper}`}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${current.dot}`}
      />

      <span>{status}</span>
    </span>
  );
}

export default StatusBadge;