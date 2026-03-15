// components/ui/ThemedSwal.ts
import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

export function themedSwal<T = unknown>(
  options: SweetAlertOptions,
): Promise<SweetAlertResult<Awaited<T>>> {
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");
  return Swal.fire({
    ...options,
    customClass: {
      popup: `swal2-popup-theme`,
      title: "swal2-title-theme",
      htmlContainer: "swal2-html-theme",
      confirmButton: "swal2-confirm-theme",
      cancelButton: "swal2-cancel-theme",
      ...(options.customClass || {}),
    },
    background: isDark ? "#1e293b" : "#fff",
  }) as Promise<SweetAlertResult<Awaited<T>>>;
}
