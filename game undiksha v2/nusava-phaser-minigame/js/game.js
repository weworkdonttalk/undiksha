/* ============================================================
   NUSAVA — PUSAKA ADVENTURE  |  game.js
   Full 2D platformer with:
   - Real sprite sheet animation (mascoot PNG)
   - Tileset rendering (blox_asset PNG)
   - In-canvas textbox dialog (textbox PNG)
   - All artifact PNGs as floating pickups
   TECHTOPIA Vol. 2 · INTEGER#8 · Undiksha
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   §0  POLYFILL — roundRect
───────────────────────────────────────────────────────────── */
function rrect(ctx, x, y, w, h, r) {
  if (w <= 0 || h <= 0) return;
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

/* ─────────────────────────────────────────────────────────────
   §1  VIRTUAL RESOLUTION
───────────────────────────────────────────────────────────── */
const V_W = 640;
const V_H = 360;

/* ─────────────────────────────────────────────────────────────
   §2  WEB AUDIO SFX & ROBLOX CHAT SOUND
───────────────────────────────────────────────────────────── */
const ROBLOX_CHAT_B64 = "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU5LjI3LjEwMAAAAAAAAAAAAAAA//uwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAOAAAkuwAiIiIiIiIiMzMzMzMzM0RERERERERVVVVVVVVVZmZmZmZmZnd3d3d3d3eIiIiIiIiImZmZmZmZmZmqqqqqqqqqu7u7u7u7u8zMzMzMzMzd3d3d3d3d7u7u7u7u7v////////8AAAAATGF2YzU5LjM3AAAAAAAAAAAAAAAAJAaRAAAAAAAAJLvkG1cjAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+7BkAAAD2zLLHT4gAlEi+ICkmAAiQZc7ud4AARMzJAsUcAICpoSV5Eqf43wU4GcMNNl/MuMfhBBNBcFCCbA9gAwHSDPhkcPnHG6CaaadSCCy4aMtNN8vl9N6kEOmm/Wggh9aFMvm6etBBD0GTTegYFxky4aGf////4AAAAGHh4eHgAAAAH5h5/gDvwAw8PD3/AAAADDz//Az/hn/4eAf/+5oxWCAIAEAAAADAYJMIECAIAAAAAggTJkyZMmTJpoRERBhBAmTB8HwfAgIOwf+UBAEAfB8HwfNQQBAEAfB8HwfAgIAgGIHD+j/////4OHAAAAAAIgCEgAAAiIAkDCkezM1CQqTJp2WAAM807eozZDcxtEAwZQMwbWk2FTUzBGkyYD4xTF02BDsxaEQ7AnQ2DIcwwPyQIG6jEYpC5g2ZmlRgWrMOApLgYCzXU6jAITFAMNBBib+zUsdVmcAQ2jIzhodFHp1+47Kopt+4W2Z65U+73urjUnZfMxyRyqE37zS4IfCC4fZ6mFje/PLB92bxS9RS2XpeOxWwd9+lqhgTgmGK8mrWN/7Z4BkcNN5P6/13xCVsXe2j53D/xp4hJn1gf+0n1PikxemVL7VNep5e7/wa7SqyKlJGpD/0/bXP1h//YvRvCVRuX65+WO6Oie+hoNuUp3ln//+sYJzkn////wkkAABCABTfGIivGIBtcAYSvOm/sw8f/nJ//ToNv/zzud//zv////XTX//+hY8HDf+g4QKpmN+YSLGmuhz/uUMHyv////l1U5RAKzIB4MVpkGBczmwDAjLNLjEzueAAPjHAUMbI41UgxqJG00GbbsZgv/7smQVBfbaa9AHcqAAT40YgOBIAFqRoUSuPlOBMTRgwABSeM6moCgBjBOgGkcDG6YAw8GACBUBjYNBc4IYKyHTkWIqRhkMgNkmBqDNENFympNlMiiBfTNDU+Zl93KJumfIOmaKOpzM3LpOoppRzEiVI0YZcIoLaWjZM01EfKCRKjNkkfG0HwBiQMSCdgxIHYIgp9RED50w71nzREwSOLUfrpzQ1OsgsoFA0Lbk2OAbA3iLFZy0gdLBF0VIFNdArpSyle3///Rlstkp3LJbTywS5by3lr////////////////////uZCmCAYgcPeEmAupBSJycJ8DVRQI5pDRjFLMx2NJtE1NnOf//0USWDFw6hAEPQGZJ42K4kIe2HLEGIsDfykXgqAzeGAgWWlMLHU0ETDIABKoNMoJMAIY0SPTF4cMqjg0gYTRbjC1vPENc+i2D0liMxx0xGKTBqkMEGA0qJDJIpMOCYaAYAiQwTYF4K+ro6cV55ubigzcy1LcZWRNSw2FcPEyXpGK1VnQiDga1VnzrGIL9u1deNpzRqyXJ7V6iINb/MJ85J9U2Q5SkUKUMMLmgL8HJidSLlTrSTUe+svGdGmfW+ilcxnTQ4Vi1LRFi0QY4OaR5iaHTqiyeebGqbmySmLqTFdzjf/oW+cPSLFu/OH1lwmuQ///+XRGQN9HSAaCAopBQYHrk0RYnRCwBTQPuUAbHQ2o1iijK1kUcpCcjw1CQ///qCEAGOAZMEDdICQIdJPGxBRZwd8LWCGkwDYIFFZaQgAAApUkWw4uqWCyZ4CwqARCJUNDDgANWlUWBQhExg0amnv0aMPho5FmRwgf/7smQWh/ZjaNGjj01iSM0n4AAQnhvxsz6O4fBBATSaABAeOaMXpiCRGKQeZbJRhsWGISUY7B5hACJMx9haEC13Z+q8mifQy6kL/CUkJ89mc+wtjDDlRsznq0OIzxpWCaN/qXHc12omRgJ6RyPQxLpNUNP/9IWy2JJKifmmNsTUOwTVpQ+L//9Lf///zJ/VU3//spv6710FJCUKk46IJLkSGmFX0lqqnS6frIN56z//////300sTTfFVB0+/9FTaaLXbl///7kyWCgL8GwEAJDGJxhZwuYhADQMLDPA2sGMjYyIMTRbakURcpaHKIL//+kYi1A2BA2PBl4OWHSVlECLYpEPlHNHgLPDePtWAAOAHDQAA0MDMw6AQ10DMwbA0MCEwiBox9M81XYQwcDYuWRCIZUrYd0u8aeDGZACWPFAYjhUY8u4aAiuZaCgDM9TAHfcyNSV94BBjaM42EesvGFhUrDEvPly8KBKf0sSG9SsCC5K00TfiJR0rzPPPMi+wP6PowuQ9Khowpxm7zt6SiwYSKAAJJlOA6i6AB0V46r6vj/GI03v//ms/3///i1a50xJ9K/zi5jxSsj5iQ1646spWWfuVXGvpW2Z6wJ5p/9f////z/uNEUr9dXI6I7+Mz5t3zNN5Yk0PfdNTh5fN///53////2ciNghCILCOJBc1CQPQiCwrGhMsSInKph5tkoi3Xf/7FyI2GojBUDhAD8WDItGwihEFRONCaqqAAAPQAhFLjmCgLBZdDrAOzKUqAwnyINDBhTTFgwTK4WRGD4OMAxFD0yARseZUyFCAHAcYbj8ZJm4ZslweM8ZMSHCi+xlShv/7smQjhvdFbM0rulx0Qc2nUAALnhyFnzIuvN5JB7ZfQAA2eCgIOAlB1l7XmyMaglncjh979Oy7swv59pyzVhVl+YZbrH4BbA3JGRDRc7PGZM4TjbxQtKV3SIeilAMNQ7Zi8OSVkK/XVtZTEhw1R8ltBFnMflgybz+tQ6CYNYFS6WmhgcIAlHEx0a1/6jP//nc7ngysgCUOkNUDF7z0zShtxzv/adh7j0osVz///8od0Tjji6pNSpJ2zveyTYsRPSfIyRFen/////9oNXJBkO9IdaBxhoNg+Ety7CsfygmMOFY6CQOwEAHApicbB0B7HWT0h2InliWTFRvJ//////////5WA/DRo1GgcAbMjCkpTf/RTVwTQMAxhIHRm0mRvChxiqLJhiDpggAhgII5gGNhgAEZhkSBgyK4GD8wSDEwmHMwmDIwOCooG5SpGxqyGULhqDGuQRG3iZXZqu+6MLeGGLleI0fXbkb8tcydl3VDlsK8ZG96hawLuqXqqqZiwDDIOJYoeKqX3dXlArVnTgmeh/+0qZ7h1EUxJS7IWnAtRvZJIpjzJeT55r5bH7gpSf3UGvamv02jCvv/aNfsyl2ccSIFOTh1zLYmvV3V6p5Mi0Flv2K7zu//NxiBRzjSOe8O8VVObdEg9o5Lv//6xlkm5JDCCYFQ8y+eJ5Lj4OUeg5BMxhxhx5kmSY4zYUC6XxMBMCTC+jqJeUiEJ4PCXyVIZutFyiW/////mZfKNYAAAAAAaYJEIjCwYMo8c4nFACETCgEMPg47jbxZ7GVR4YfHpQ4jHY4MUjk0OSTG5pDCyYgQJjtNhROmCwyztxiIItCgVP/7smQihvddbM1bj08gQa2YAAANnht9oz2OberBJDafAAA2eDdlTaody67juo1SHrsHQywNnb6QBSyOQ3rsW7JJA+9pwmnuUtpNdMxqCnahqAlAtlRgYAgjSSIKO9vhE3KpPzIQzqCVWNTcrbtZd18Yx+nuXlpFjkMtxTjOp0gySzrhQLDOdkEz2OF2//sUbcl4/9Oo2jiIyeLqjaPxXxAvJZ0pyUVXcxewYQJbD2lNR3vED3wxL+o35rMbNHSCy4nrCfqRfN///4zv//1j1IKYsymMOZmpPmI5xJBNBeJYS8eQcgT0cYtRMDMkEg4B4DyGHJM2GKOYLuMQjR/KIjAyhKnjV/////OghiUoAABcRA8wYAwwHGJ96YtC5gwCGKxuZITJ4UIGIg+ZXDogkp2oSCgwwIcP8qjO0AKBwVRTaloClQYdiQUY6Bva8YryEMDFs8oTGvBPvFUq1NToie3j/MVwVUZthsbjKrGxDtzyK1WNDCwnezSxlMLSyJ907+X6z4JuuTA9CWG8ShQH4wMbOQ9InWb6CW5mpUoZM1n/M+u9+P//nX+P/6+F3s6mxH53yb9vAalLOq2Nnf6d/GM+bPbo+HuPDXeHP57pXv2////GGw7zQkV+kEnjEMlBIh62I5Xuava9///1HxLSiPYiiZLuFRHgWjhCKjHG06JsS5UWkiIyPYcyhLhxhzRyEmDpGsoFah2ko47iefYxPf7oJnDxu6CDF8+XDyf8mioJSyqAAwACpkFgJAoaGhyGgJOjAwFTHlEzOt4DNcVjBcozO9zTXuKDEEgzOU9zL8tgQGwiCoxNHUyVG0xkDEwnC8BCeP/7smQghPeGaM6zsWegQe0X8AASrlspoz0OYXPBFzSgAABSuLBANANUe1Y1p4Hyfiu/dlTaHovKY3UmXmgiYsQVKNSiRyOlg9/Y1ye//tf8ooIeYhF3RbBny9DrW21ZE48ur6I4tXMUB9D5FeKoYSDRQugIFDch2goRlwXg0g9QTYOoQAHeJ7KIt4zwucZg0Nv///LpbmBcH89QjBSYJUR6lJygwimBUjYhe5DM0a9EwiPy2qw4PERh66ZmZmZZShoUw6EwkhwHoBhSNyaYmQeGB0r7//rMBcgxhOEqAkwGHJ4ZcE5Av4gkBICGD4AAgDgBRG/qbIeTwZcCxgDQAywHXFzCFwsjFHAXUL3j+DY+WT4x47xGADAI5GCASOi45ibCY9GSROdObJjIzgAOm2jUY1Fpno/GwvqPZowcpTJb8O8N8085TFCDM0oYILREQjAohLarUa7PLVY9NTHKTGNODQONBMMySksSvDHVmfmqOloYzRbx///X8o4450/RNOiFePbfeTKcutDNBrHnyi7WuTGUgX07UecctMBXFs0GKct6v9xkh1bG5LSeSVP1ZvuNC+f///////74yI27AU5GwhRuG0zIMBorLKygoXIpFIfYkXZWHlhJLDsXHHX//2+yatwbko6TUx25IqJJN///DL4b+kM4MIHGiKg3XA2FILKicA3KEQaLwbQekOeh/U1QipFQoNC1wQsOWBrRhNhyACgkNyBBgQQMcAyR8FhZqLJHeb3AAAEALgmFQonGcRHxjoamVi2ZImxoksgpHmT3Ma7855sJmT0mbeDxqE7jo4MTlE4YazHB6MbkIxcNxIVDAf/7smQfBPbpaM9Dkk5QQm0oIAAZrh1pnz0uYPPJHbOhwAe3yQKBc0ySypwIDlbo234eh5XDo4nBsOX4cztV0XuePuQ9roddSaZICfSbLAoYmS8cGYFJk8JuG8bEP8fTjtUXjAvikAGgC/grcJYK6AVoEHBzBjohGGmjJC9FGExGkIQpifxS4hMggh///yg0ipFy3oEb5oeGhsXOD8IHE2NwRegRfMfFMj4pP4bYN/////+EBRzBPMVEgoLDYqkZFIqenv//////////7iqM1uJiIFwk7F/gIoiErmucrXxJIIAXH3/////5/vWGANXDBS6bBRydOZZCxqYGJxVyQakr6ZeG/egAGAAUXxwYGPh4bGv5qQ7GjE0ZaLxwf6GCgCDlcYXaZzx0m5yqYqVRwCbGG6oaqMhixYAZFGrB4LMABOwGAoxwMhoSoNA4Eql8PvE8bhza256UPpKvgimfKxUi0dltPVh6C3/hrmOuVOUHzMOP5bdyCnekcASh12bxCBlpWnkhzv8/UFZSuGWXqfXk0teDtLwCAOMwMgNEmmLIgKxHFvtbaZHn6ZvO2LV7////dlGIOAyFhaHngwAgKACAACA8EAAiZQoB5Q0tOFMTkyggAgYFCAtJFChZd/z3CyK4bA0CZwBKhYEg8wQh6Ayr///O9c3CwJ9iZS3oW/dErTZsgEZasppnOWD0uwMn/////////SbWamRuJaPExHqeWSpgXv/0ThJD2TRBygvE0xMiWTLpKtOqgAAAADASssAwxCXQ5gg4ImOROaQFZgoGiybMYg5TIyodjQpAMLCg1v5jjApMEhUHMMw+KCQJGgXcGP/7smQdBfaqaNFbj01gRKxoYANR8l4Rkz0O4fOZC7HigAyLyfkw6FzPqNJiOgkAoDW3Lo1F0W5TpFNyJB7Eho3rubWn1WyTaQfQMzYZaYVsBehzSasxR3E6TGS4sibZbRf//C8Gz2N7INmDEP01RJwyi2l0L6Yq+QVkH2qWE508r9MNf///////03vcygToUAuTJLOEASIgoC8k9apGUtuL6OIU3TohukE5xSfm///+31qiiGSSFGhcmxFdBrbTv///duVS2UrKMifMIcSaAxQCBzTkRIsY2SZcGYAkpeeCcPFiI6FwIBLiy1aYFDs8QXsxWn7/////////////9agHwVIVgAAQAkjAYAIuClxUzMElhIl4EgkMJEpMAwUSRMF1KMXgmEh0Mb8bNng4Aw9GIBHFBaGFALmNTvmcwbGHYgmIixGSoJhgCGfwOHPhQKm7c4zA8NodKaAHXnIjFYvH5BY/XL8zF4elsYgKF4P9EcX6ldljDN52T15LB78x4LoR/kSTbuXt///+8oLhc5Ab+LPnihysDGmMjaI8EuLATA2ToJQDcDLRgTjmdzCnWtVf///////6+amkmF2hSYTJzIZXaqbWDOFrXaNPKQcvXfYl+6GL6GPVeb6EN+ToGmh0VI/H//zbr36Wymk3Bsk0ndZfv//yuH/oeRq2Y5wJeSCWYh1ttBMBweuS5SMOkIMYUoMAAaXuEyvWlOGymrFv////oRTuro9yE////6vyf6Mp7MCeSepniwRgchprwFgyABhki5x0VgCDwKG+ZYhKIAGMKkWMMClMMQbNCGPNzCbMGAaDA/Mkh1MRwGMQCPNrDP/7smQdjPcmZc4Dr0ViRqy40AMH8hthozIu7eeBFzRiQAeryLMVQxMIycMzRGAwCp0CAAxoK0vIEQR7BSFjJUQllP1WoXRmNaSisb215eHAbpmhLNCN2+tq8c1UNLiY6x2k2RHREy4E6LmZ1v//kqLQy9gkQFUNUfAt0IegW4wzBHYIURoOIkZCDNDBFcPJKHcfY9ODa/7////rS3+JAVTiU64AtYKO8EYAFACkgFEx0rNS5thO4M2CIRhZUJYL//zjGa5DAA0gK2oamEvv//3xaFnjrGOpgymcnmYqwthLlP8sND4IGzWEyJ9WVWqaPSdTCck3////0U0weY53VBAW+Q8z/e/LHkzOT/0ZUjcbTxwgHOwa8AME5iYUp0MQBgoAZhEpZ38hhm4HJqGaaiQmJlxtdYe3GA7SMcQzDzEBEAykmYlhmogBoMz/wNpXAsRmSGYOGawXAAgictiCDFyOYf0zbrB6k9VCCZTpgU1CkqoVS9Q5cObnhdnWkIScXbkjIqHvVg/hokpL7ReZ4Ff/8wx8st0N8VCUQa5cUMeLramSpNk8NM/iRlgOhTpA6kPExMF1rNou////////84y6llp8xLzSMLjvFe8nTtdf4pi24rNi/iNTFiMun1cX///9batudc47aoXXda+Hbl/8B3hyTb/1CzrcHFntNwnJ7DbU0qsMiiYz7Ddm1+3//1U0081qmiHDj9CvQ3/NU7nEuRHKZ/s7OgWR+E8LkKwkljyXkRNVgAAAAAWQiC4EGCA2GLdMmU4amNQLGGbgm4hRAEOzDwPzE0OmQCRjjAWGC5hGRYDiwGjAZgUFiUDzCAfTBf/7smQejtbSaMvLr0VgSGyoQAIN8lxxoyhOvPyBG7ZdiAknoIDzCMLBgVQuAT/lQA0HqZrLgLziH68Riegu3ppMsRuhsmocekqs0ZSmdGGT4hJfRcBd0mzh0GMIkW0GuIWrVUdbjK2srC6xv/5iwI3aGvKIhKAuTpnP+2SVIUX5ybD9H8jFuKwNsFzVL1xVxg9Gr////GUHIbxzDlYRs5qjZTCmJ/hWFmYaEJpKrQgKTBrj/kf6WsNeqnTQ61EtlD76YZBAOSQf//xyQyKGWSuRUuF4aoAmFvJOo5k///WiYl0Rg2ejOhFROUuZF59Rt/pJo9jJJbKRb/0nJwT4hgjoFGC7BzjbnwRQMigUmAICmesenDMbG+YQmbkZGj/LnhQKmYgXmOYlmHAymFIxmCwUGBIhGRhYGE4QAoJRQFzCkEkVhGIZiGC5iATxhmF4BC1iKlSarru9LY2/T6uZdcaA3/a5YfzPuM7FYAhidk83EWwPK8rDaFvy6TAEpktAcB5e5s6LB/Isg4/nR2kqScai9B/7yHthNCCezw9UqmG8+yDmkjjonWuuCcj2RLZIn1mx+k8Q4e6vrKcwJCEkUX/21fuaee6CKTJllcoVZBMIjtVFMcWRLOHHjtj5xMxjhSRQp+RYex6sRSwiiksAf/961HyZKRua///XSRUs4bk6ZJps///6YoQDXxoJqUtR9FT///zM8lF4jf//RAy07oFCffdaYWQBsYBBCPsEhPv+f/0RmIABAABuKoGGwAmLRAncRVGO5HGH5XGNMIGWpkiQ8CQXBUojA4BAwBzAcHDCcPCYAcXFMsCMGAMGUNidWuY1wP/7smQfgPauZ0w7ulvwRM2nUAGv9hyNsSsu5RPBILadAAPTwFbidEugtakksSh+4abs77ebWQ0vJlC2XvfGVZU1JAMvvui+0BNcL4pXy1AQ4aObEk3rLAFghI5FHMfiB5l0Y1DnNZf+VmofFnFBCl5oiaHyEEAnjsJx/K4SFBryxAd5NHeaGUfnjMyUd/8/6qsX6Um2baTDWzkfGmghatcVrI6U0QJcW9x/24qY4qZf/De71ZSKyDoFn6v/+gmGwAJ4/CFAF8RZKJq/////oDiHMdQf////NHQyUESWV3//3JiM51gqlQtb/8ihwn0FIT9rHcEnBntn+v/7vBHi96AAgAAArC4KAUMwARR1L1RskDxh2BxjOfh7OVgoGYiBkGigZ2BAYSgggRMHxCIQUn14GBgaqlS7MMBsMgxvEQIiwaGBYBF7F1vI+sLhl2lxOU5b1tWh2Gl3RCljDDoNtwBI3uZ7Bjv2UjlCl5JojLQKbDBysQ0cIsAEFvnBejmms0VjkBuS8kDyTvP+pfqRKOyDTlSd2XaXi1ZezAy+NA16C3K///TvOzEnZWlJ95flz+bHPj//of8HfCaY038rnJf/HVED6ya6Y7hCJgm3G35IUMHFiws1emLElnUcQaLloO/+fDP/8wfEQBYAFQC+MrEWA2hoBqeQh9n//////////Ww+iqOoonBmSt8ckXKQUqyHDNFR+cHdEhIU6ITGYnEZIdItvR8oA0Ug4OsCBQBTkimJhyChKAJhNHpssAQWBoEC6Z2GeYogWAQLAAJGFIXmAYDIUuukSzcuW1otsSAOTAYKhIHC2qx10afbY9UNYJfTxf/7smQjiMZBasw7r1zgP62XwAKD9Bq1ryhV3IAJBDWhyoCgAmnFXMcVQxlDJvdK/D7FHzxcmCrSiVhulugH+Jqpi7EKQleZXzLrO3Nv34c8LEd76sTArYTYtOVZrJGpP1OTQHx5UPGr0JbmO1I5lF/6RWYX/xOpbCQuuZ5OK8oR/h+qgmur/H5gZLeSjp5K/0SVow9P9Q1QNFVSgmk7VM7P8dqytFNNIuN03MCKE41MIDQXQLo/BNoPy////X+g/regL9zCCLlu5wndEsAFNCyc2iIhyV4XlxEiIR67G7n86Bi2CipALoEgKYvAQFQ+MUF3P1BqMPBsMBxSMBhGMjwyHQAEALDgKAgCSy5hSJoGC0oARBCXaQ9Lqh7IJOROQAsCdF1n+1Ga0ZnonH5Vn2W0tLSUMtptbszXzUqnn6ncX0iLns6fZkbUpC0RtpXWlditc1lq1ct839WxzLvMvlusLmt54v7EZdnlhjL5LZrZXMsr9Tede1T9z3a/eOH7uZ5597rDVbG/lfy7+qa1j///5539Zdqbz1nvuf95vutc3/58q3vx3d/usMruH2sLX85jjU1z7n71evSgGCP/////////+nICfpoVH74Tgs4tEsz///+p5/ZJrnkz6Mcb6ny6MeQKeh6uf1Ooyu55hVHWptDFcxT/tM6NUuoAAAAABO6/XJSytMAAACDI5GvTA5BMqANXRksPGOjyTIgwUIjBYHCpDCAgYGL5WEzBwjGjMYGAQcfg4U2iyA0eVEcMgImIXTgJVrLtFd4ceLDJzrUeaHYSyhSC90PhCCQkEyL6SBh7yrEh9tpS+yEpN5HRACnQ3v/7smQ7gAgFYUrucyAAZDCIcMEoAFYdHSS9h4AZJBsfg5ggAMEt3TQdnCy2V21bY9nLkp37gVgbQ2VyBhjXn6nWnReA4Ao32dFsz8t+iu+7L2TOg1H5bWgaU0VrGzEK8Wt1qO5leh2UXnQlUgiszL+7s4c/nO//65rLPu6vPzr557xz73Wu4f3//m+/vL8ddzy/8ed/vOdzqVOY2AEFwOXEyFf/mQ5/+KCFxQmXfiCEC/P///////////PG0jBUlRMNKiwciEdRZ3NLfI0JW+ds3upKYapZic/RkIiMmKiSaY+hY0kjcwuXIJdUU1XdTqnEw/IphrPdmc8gKMSqYUPMa1ksVL////s5GX////oVLiBgAAkaYkmpZqSZigYIGa3iAos6sV+YCUyLvFyi8RcIBJAIQIISEhKpkTxzIay6hK5PK5m3CVyHIcrmbdWFiVz62XrCrVa+3BYVanVCrWXdXr17X2hPXr2vtCjWrrEJ8+jWzaE+fW3mr18+fW3Wr17a3rWta/Na1rr2tBi117WfQq19rQrDYQUFdBgp4KChXQUF+KCm5AorgUEuhBQ3IKCvBgo6KCjegoL4KCm5AoL4UEnQNgJASBsIxOXfay561p2pjGfKUvlK3qX//////6GMYxjP5jGMYxStQxjBgVO/8sDQMuEQNA04Gg6VBYGv+sFQVDv6gaBV0sDNTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7smQAD/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==";

const SFX = {
  _ctx: null,
  _chatBuffer: null,
  _chatAudio: null,
  _decoding: false,
  enabled: true,

  init() {
    if (!this._ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this._ctx = new AC();
    }
    if (this._ctx && this._ctx.state === 'suspended') {
      this._ctx.resume().catch(() => {});
    }
    this._preloadChat();
  },

  _preloadChat() {
    if (!this._ctx || this._chatBuffer || this._decoding) return;
    this._decoding = true;
    try {
      const bin = atob(ROBLOX_CHAT_B64);
      const len = bin.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
      this._ctx.decodeAudioData(bytes.buffer.slice(0), buf => {
        this._chatBuffer = buf;
        this._decoding = false;
      }, () => {
        this._decoding = false;
      });
    } catch (_) {
      this._decoding = false;
    }
  },

  _p(fn) {
    if (!this.enabled) return;
    this.init();
    if (this._ctx) fn(this._ctx);
  },

  chat() {
    if (!this.enabled) return;
    this.init();

    // 1. Primary: Instant Web Audio buffer (0ms latency, zero browser lock)
    if (this._ctx && this._chatBuffer) {
      try {
        const src = this._ctx.createBufferSource();
        const gain = this._ctx.createGain();
        gain.gain.value = 0.85;
        src.buffer = this._chatBuffer;
        src.connect(gain);
        gain.connect(this._ctx.destination);
        src.start(0);
        return;
      } catch (_) {}
    }

    // 2. Secondary fallback: HTML5 Audio with base64 data URI
    try {
      if (!this._chatAudio) {
        this._chatAudio = new Audio('data:audio/mp3;base64,' + ROBLOX_CHAT_B64);
        this._chatAudio.volume = 0.85;
      }
      this._chatAudio.currentTime = 0;
      const p = this._chatAudio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // Local asset fallback
          const fa = new Audio('assets/roblox-islands-bedwars-chat-sound.mp3');
          fa.volume = 0.85;
          fa.play().catch(() => {});
        });
      }
    } catch (_) {
      // 3. Tertiary fallback: procedural crisp chime
      this._p(c => {
        const o = c.createOscillator(), g = c.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(800, c.currentTime);
        o.frequency.exponentialRampToValueAtTime(1400, c.currentTime + 0.08);
        g.gain.setValueAtTime(0.16, c.currentTime);
        g.gain.linearRampToValueAtTime(0.001, c.currentTime + 0.12);
        o.connect(g); g.connect(c.destination);
        o.start(); o.stop(c.currentTime + 0.12);
      });
    }
  },

  jump() {
    this._p(c => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(180, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(440, c.currentTime + 0.14);
      g.gain.setValueAtTime(0.13, c.currentTime);
      g.gain.linearRampToValueAtTime(0.001, c.currentTime + 0.14);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + 0.14);
    });
  },
  land() {
    this._p(c => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(95, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(55, c.currentTime + 0.09);
      g.gain.setValueAtTime(0.09, c.currentTime);
      g.gain.linearRampToValueAtTime(0.001, c.currentTime + 0.1);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + 0.1);
    });
  },
  discover() {
    this._p(c => {
      [440, 554, 659, 880, 1109].forEach((f, i) => {
        const o = c.createOscillator(), g = c.createGain();
        const t = c.currentTime + i * 0.07;
        o.type = 'sine'; o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.09, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        o.connect(g); g.connect(c.destination);
        o.start(t); o.stop(t + 0.3);
      });
    });
  },
  correct() {
    this._p(c => {
      [523, 659, 784].forEach((f, i) => {
        const o = c.createOscillator(), g = c.createGain();
        const t = c.currentTime + i * 0.09;
        o.type = 'square'; o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.07, t);
        g.gain.linearRampToValueAtTime(0.001, t + 0.2);
        o.connect(g); g.connect(c.destination);
        o.start(t); o.stop(t + 0.2);
      });
    });
  },
  wrong() {
    this._p(c => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(200, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(100, c.currentTime + 0.22);
      g.gain.setValueAtTime(0.08, c.currentTime);
      g.gain.linearRampToValueAtTime(0.001, c.currentTime + 0.24);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + 0.24);
    });
  },
  step() {
    this._p(c => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(72, c.currentTime);
      g.gain.setValueAtTime(0.04, c.currentTime);
      g.gain.linearRampToValueAtTime(0.001, c.currentTime + 0.06);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + 0.06);
    });
  },
  pipe() {
    this._p(c => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(320, c.currentTime);
      o.frequency.linearRampToValueAtTime(130, c.currentTime + 0.35);
      g.gain.setValueAtTime(0.12, c.currentTime);
      g.gain.linearRampToValueAtTime(0.001, c.currentTime + 0.38);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + 0.38);
    });
  },
  victory() {
    this._p(c => {
      const notes = [
        { f: 392.00, d: 0.10, t: 0.00 },
        { f: 523.25, d: 0.10, t: 0.11 },
        { f: 659.25, d: 0.10, t: 0.22 },
        { f: 783.99, d: 0.12, t: 0.33 },
        { f: 1046.50, d: 0.18, t: 0.46 },
        { f: 1318.51, d: 0.22, t: 0.65 },
        { f: 1567.98, d: 0.45, t: 0.88 },
      ];
      notes.forEach(n => {
        const o = c.createOscillator(), g = c.createGain();
        const startT = c.currentTime + n.t;
        o.type = 'square';
        o.frequency.setValueAtTime(n.f, startT);
        g.gain.setValueAtTime(0.09, startT);
        g.gain.exponentialRampToValueAtTime(0.001, startT + n.d);
        o.connect(g); g.connect(c.destination);
        o.start(startT); o.stop(startT + n.d);
      });
      [261.63, 329.63, 392.00].forEach(f => {
        const o = c.createOscillator(), g = c.createGain();
        const startT = c.currentTime + 0.88;
        o.type = 'triangle';
        o.frequency.setValueAtTime(f, startT);
        g.gain.setValueAtTime(0.08, startT);
        g.gain.linearRampToValueAtTime(0.001, startT + 1.2);
        o.connect(g); g.connect(c.destination);
        o.start(startT); o.stop(startT + 1.2);
      });
    });
  },
};

/* ─────────────────────────────────────────────────────────────
   §3  ASSET LOADER
───────────────────────────────────────────────────────────── */
class Loader {
  constructor() {
    this._imgs = {};
    this._pending = 0;
    this._cb = null;
  }
  load(key, src) {
    this._pending++;
    const img = new Image();
    img.onload  = () => { this._imgs[key] = img; this._tick(); };
    img.onerror = () => { console.warn('Missing asset:', src); this._imgs[key] = null; this._tick(); };
    img.src = src;
  }
  _tick() { if (--this._pending <= 0 && this._cb) this._cb(); }
  onDone(fn) { this._cb = fn; if (this._pending <= 0) fn(); }
  get(k) { return this._imgs[k] || null; }
}

/* ─────────────────────────────────────────────────────────────
   §4  TILE RENDERER
   Procedural Candi Nusantara Canvas 2D Renderer (No blox_asset.png needed):
   - batu_candi (stone): Carved andesite temple blocks with 3D bevels & relief accents
   - batu_merah (brick): Warm Majapahit terracotta brickwork with running mortar
   - ground: Rich tropical fertile subsoil with dynamic lush grass blades
   - Decorative temple props: Stupa, Pilasters, Tropical ferns, and Temple vines
───────────────────────────────────────────────────────────── */
class TileRenderer {
  constructor() {
    this._cache = {};
  }

  /**
   * Procedural platform rendering without external image dependencies.
   * Renders modular 24px blocks with authentic temple textures.
   */
  drawPlatform(ctx, _sheet, sx, sy, pw, ph, type) {
    const BS = 24;
    const cols = Math.max(1, Math.round(pw / BS));

    ctx.save();
    ctx.beginPath();
    ctx.rect(sx, sy, pw, ph);
    ctx.clip();

    if (type === 'ground') {
      this._drawGround(ctx, sx, sy, pw, ph, cols, BS);
    } else if (type === 'brick') {
      this._drawBrickPlatform(ctx, sx, sy, pw, ph, cols, BS);
    } else {
      // Default: 'stone' (Batu Candi Andesit)
      this._drawStonePlatform(ctx, sx, sy, pw, ph, cols, BS);
    }

    ctx.restore();
  }

  _drawStonePlatform(ctx, sx, sy, pw, ph, cols, BS) {
    // 1. Base Andesite body
    ctx.fillStyle = '#332b25';
    ctx.fillRect(sx, sy, pw, ph);

    // 2. Beveled top edge with gold-bronze highlight
    ctx.fillStyle = '#4d4239';
    ctx.fillRect(sx, sy, pw, 3);
    ctx.fillStyle = 'rgba(212, 175, 55, 0.28)';
    ctx.fillRect(sx, sy, pw, 1.2);

    // 3. Blocks & relief carving
    const rows = Math.ceil(ph / BS);
    for (let r = 0; r < rows; r++) {
      const by = sy + r * BS;
      const bh = Math.min(BS, sy + ph - by);

      for (let c = 0; c < cols; c++) {
        const bx = sx + c * BS;
        const bw = (c === cols - 1) ? (sx + pw - bx) : BS;

        // Block inner surface
        ctx.fillStyle = ((c + r) % 2 === 0) ? '#383029' : '#302823';
        ctx.fillRect(bx + 1, by + 1, bw - 2, bh - 2);

        // Chiseled groove border
        ctx.strokeStyle = '#201b17';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);

        // Subtle relief motif in center of surface blocks (diamonds/lotus petal)
        if (bh >= 18 && bw >= 18) {
          ctx.strokeStyle = 'rgba(212, 175, 55, 0.16)';
          ctx.lineWidth = 1;
          const cx = bx + bw / 2;
          const cy = by + bh / 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 4);
          ctx.lineTo(cx + 4, cy);
          ctx.lineTo(cx, cy + 4);
          ctx.lineTo(cx - 4, cy);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }

    // Outer edge caps (rounded corbel effect)
    ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.fillRect(sx, sy, 2, ph);
    ctx.fillRect(sx + pw - 2, sy, 2, ph);

    // Bottom shadow
    ctx.fillStyle = '#171310';
    ctx.fillRect(sx, sy + ph - 2, pw, 2);
  }

  _drawBrickPlatform(ctx, sx, sy, pw, ph, cols, BS) {
    // 1. Base Terracotta body
    ctx.fillStyle = '#6b2b16';
    ctx.fillRect(sx, sy, pw, ph);

    // 2. Warm top highlight
    ctx.fillStyle = '#9e4325';
    ctx.fillRect(sx, sy, pw, 2.5);
    ctx.fillStyle = 'rgba(255, 200, 160, 0.18)';
    ctx.fillRect(sx, sy, pw, 1);

    // 3. Running bond brick pattern
    const rows = Math.ceil(ph / BS);
    for (let r = 0; r < rows; r++) {
      const by = sy + r * BS;
      const bh = Math.min(BS, sy + ph - by);
      const shift = (r % 2 === 1) ? 12 : 0;

      // Draw horizontal mortar bed
      ctx.fillStyle = '#3c1409';
      ctx.fillRect(sx, by + bh - 1.5, pw, 1.5);

      for (let c = 0; c < cols + 1; c++) {
        const bx = sx + c * BS - shift;
        if (bx + BS <= sx || bx >= sx + pw) continue;

        const renderX = Math.max(sx, bx);
        const renderW = Math.min(sx + pw, bx + BS) - renderX;

        // Brick body variation
        ctx.fillStyle = ((c + r) % 3 === 0) ? '#7a3119' : ((c + r) % 2 === 0 ? '#6d2a15' : '#5f2310');
        ctx.fillRect(renderX + 1, by + 1, renderW - 2, bh - 3);

        // Mortar vertical head joint
        ctx.fillStyle = '#3c1409';
        ctx.fillRect(bx + BS - 1.5, by, 1.5, bh);
      }
    }

    // Bottom shadow
    ctx.fillStyle = '#240a04';
    ctx.fillRect(sx, sy + ph - 2, pw, 2);
  }

  _drawGround(ctx, sx, sy, pw, ph, cols, BS) {
    // 1. Rich tropical subsoil
    const grad = ctx.createLinearGradient(sx, sy, sx, sy + ph);
    grad.addColorStop(0, '#533c2a');
    grad.addColorStop(0.3, '#432f20');
    grad.addColorStop(1, '#271b12');
    ctx.fillStyle = grad;
    ctx.fillRect(sx, sy, pw, ph);

    // 2. Earthy strata & stone specks
    ctx.fillStyle = 'rgba(20, 12, 6, 0.35)';
    for (let x = sx + 8; x < sx + pw; x += 32) {
      ctx.fillRect(x, sy + 18, 12, 2.5);
      ctx.fillRect(x + 14, sy + 32, 8, 2);
    }
    ctx.fillStyle = 'rgba(160, 130, 90, 0.2)';
    for (let x = sx + 20; x < sx + pw; x += 44) {
      ctx.fillRect(x, sy + 14, 3, 3);
      ctx.fillRect(x + 22, sy + 26, 4, 2.5);
    }

    // 3. Lush grass top band
    ctx.fillStyle = '#3e702c';
    ctx.fillRect(sx, sy, pw, 6);
    ctx.fillStyle = '#659c3a';
    ctx.fillRect(sx, sy, pw, 2);
    ctx.fillStyle = '#8bc34a';
    ctx.fillRect(sx, sy, pw, 1);

    // 4. Jagged grass tufts hanging downward
    ctx.fillStyle = '#3e702c';
    for (let x = sx; x < sx + pw; x += 6) {
      const bladeH = ((Math.abs(Math.sin(x * 0.4)) * 4) | 0) + 2;
      ctx.beginPath();
      ctx.moveTo(x, sy + 5);
      ctx.lineTo(x + 3, sy + 5 + bladeH);
      ctx.lineTo(x + 6, sy + 5);
      ctx.fill();
    }
  }

  /**
   * Procedural decorative props (Stupa, Pilaster, Fern, Vine)
   */
  drawProp(ctx, _sheet, type, sx, sy) {
    ctx.save();
    if (type === 'stupa') {
      this._drawStupa(ctx, sx, sy);
    } else if (type === 'pillar') {
      this._drawPillar(ctx, sx, sy);
    } else if (type === 'fern') {
      this._drawFern(ctx, sx, sy);
    } else if (type === 'vine') {
      this._drawVine(ctx, sx, sy);
    }
    ctx.restore();
  }

  _drawStupa(ctx, sx, sy) {
    // Borobudur style perforated bell stupa (approx 36x40)
    const cx = sx + 18;
    // Octagonal / tiered square lotus base
    ctx.fillStyle = '#383029';
    ctx.fillRect(cx - 16, sy + 30, 32, 6);
    ctx.fillStyle = '#4c4238';
    ctx.fillRect(cx - 14, sy + 26, 28, 4);
    ctx.fillStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.fillRect(cx - 14, sy + 26, 28, 1);

    // Bell dome
    ctx.fillStyle = '#3f362e';
    ctx.beginPath();
    ctx.moveTo(cx - 13, sy + 26);
    ctx.quadraticCurveTo(cx - 14, sy + 12, cx - 6, sy + 7);
    ctx.lineTo(cx + 6, sy + 7);
    ctx.quadraticCurveTo(cx + 14, sy + 12, cx + 13, sy + 26);
    ctx.closePath();
    ctx.fill();

    // Perforations (rhombus lattice holes)
    ctx.fillStyle = '#1c1612';
    [-7, 0, 7].forEach(ox => {
      ctx.fillRect(cx + ox - 1.5, sy + 16, 3, 3);
      ctx.fillRect(cx + ox - 1.5, sy + 21, 3, 3);
    });

    // Harmika / Cube box
    ctx.fillStyle = '#4d4238';
    ctx.fillRect(cx - 5, sy + 4, 10, 4);

    // Spire / Chhatra (top pin)
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(cx - 1, sy - 2, 2, 6);
    ctx.beginPath();
    ctx.arc(cx, sy - 3, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  _drawPillar(ctx, sx, sy) {
    // Ancient stone temple pilaster (width ~20, height ~80)
    const pw = 20;
    // Base plinth
    ctx.fillStyle = '#2c251f';
    ctx.fillRect(sx, sy + 70, pw, 10);
    ctx.fillStyle = '#483c33';
    ctx.fillRect(sx + 2, sy + 67, pw - 4, 3);

    // Shaft with vertical fluting
    ctx.fillStyle = '#3a3028';
    ctx.fillRect(sx + 3, sy + 10, pw - 6, 57);
    ctx.fillStyle = '#251e18';
    ctx.fillRect(sx + 6, sy + 10, 2, 57);
    ctx.fillRect(sx + 12, sy + 10, 2, 57);

    // Capital & abacus top
    ctx.fillStyle = '#483c33';
    ctx.fillRect(sx + 1, sy + 7, pw - 2, 3);
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(sx + 3, sy + 6, pw - 6, 1.5);
    ctx.fillStyle = '#2c251f';
    ctx.fillRect(sx - 1, sy, pw + 2, 6);
  }

  _drawFern(ctx, sx, sy) {
    // Lush tropical ferns
    ctx.fillStyle = '#2b6628';
    ctx.beginPath();
    ctx.moveTo(sx + 12, sy + 16);
    ctx.quadraticCurveTo(sx + 2, sy + 8, sx - 2, sy + 2);
    ctx.quadraticCurveTo(sx + 5, sy + 9, sx + 12, sy + 16);
    ctx.fill();

    ctx.fillStyle = '#438e3e';
    ctx.beginPath();
    ctx.moveTo(sx + 12, sy + 16);
    ctx.quadraticCurveTo(sx + 12, sy + 2, sx + 12, sy - 4);
    ctx.quadraticCurveTo(sx + 15, sy + 4, sx + 12, sy + 16);
    ctx.fill();

    ctx.fillStyle = '#347730';
    ctx.beginPath();
    ctx.moveTo(sx + 12, sy + 16);
    ctx.quadraticCurveTo(sx + 20, sy + 7, sx + 26, sy + 2);
    ctx.quadraticCurveTo(sx + 19, sy + 9, sx + 12, sy + 16);
    ctx.fill();
  }

  _drawVine(ctx, sx, sy) {
    // Hanging jungle creepers
    ctx.strokeStyle = '#2f5b24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx + 10, sy);
    ctx.quadraticCurveTo(sx + 4, sy + 18, sx + 12, sy + 36);
    ctx.stroke();

    ctx.fillStyle = '#438435';
    [6, 16, 26].forEach((oy, i) => {
      const lx = i % 2 === 0 ? sx + 3 : sx + 11;
      ctx.beginPath();
      ctx.ellipse(lx, sy + oy, 4, 2.5, (i % 2 === 0 ? -0.4 : 0.4), 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   §4b  HAZARDS & SPIKES (Duri Candi Obstacles)
───────────────────────────────────────────────────────────── */
class Hazard {
  constructor(data) {
    this.x = data.x;
    this.y = data.y;
    this.w = data.w;
    this.h = data.h;
    this.type = data.type || 'spikes';
  }

  checkCollision(player, parts) {
    if (player.invFrames > 0) return;
    if (
      player.x + player.w > this.x + 4 &&
      player.x < this.x + this.w - 4 &&
      player.y + player.h > this.y + 4 &&
      player.y < this.y + this.h
    ) {
      player.damage(20);
      player.vy = -6.5;
      player.vx = -player.facing * 3;
      parts.burst(player.cx, player.y + player.h, '#ef4444', 14);
      SFX.wrong();
    }
  }

  draw(ctx, cam) {
    if (!cam.sees(this.x, this.y, this.w, this.h)) return;
    const { x: sx, y: sy } = cam.toS(this.x, this.y);

    ctx.save();
    // Solid base bar underneath spikes
    ctx.fillStyle = '#261f1a';
    ctx.fillRect(sx, sy + this.h - 3, this.w, 3);

    const count = Math.floor(this.w / 12);
    for (let i = 0; i < count; i++) {
      const px = sx + i * 12;
      // Bronze/andesite stone spike triangle
      ctx.fillStyle = '#5c432d';
      ctx.beginPath();
      ctx.moveTo(px, sy + this.h);
      ctx.lineTo(px + 6, sy);
      ctx.lineTo(px + 12, sy + this.h);
      ctx.closePath();
      ctx.fill();

      // Sharp golden highlight on left edge
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, sy + this.h);
      ctx.lineTo(px + 6, sy);
      ctx.stroke();

      // Hazard glow at base
      ctx.fillStyle = 'rgba(220, 38, 38, 0.45)';
      ctx.fillRect(px + 2, sy + this.h - 3, 8, 3);
    }
    ctx.restore();
  }
}

/* ─────────────────────────────────────────────────────────────
   §4c  PATROLLING ENEMY (Penjaga Candi ala Goomba)
───────────────────────────────────────────────────────────── */
class Sentinel {
  constructor(data) {
    this.id = data.id;
    this.x = data.x;
    this.y = data.y;
    this.w = 24;
    this.h = 24;
    this.minX = data.minX;
    this.maxX = data.maxX;
    this.speed = data.speed || 0.8;
    this.dir = 1;
    this.alive = true;
    this.squashTimer = 0;
  }

  update(dt = 1, player, parts, onScore) {
    if (!this.alive) {
      if (this.squashTimer > 0) this.squashTimer -= dt;
      return;
    }

    // Patrol movement
    this.x += this.dir * this.speed * dt;
    if (this.x <= this.minX) { this.x = this.minX; this.dir = 1; }
    if (this.x + this.w >= this.maxX) { this.x = this.maxX - this.w; this.dir = -1; }

    // Collision with player
    if (
      player.x + player.w > this.x + 2 &&
      player.x < this.x + this.w - 2 &&
      player.y + player.h > this.y &&
      player.y < this.y + this.h
    ) {
      // Mario Stomp: only when falling distinctly with downward speed on top 7px of sentinel
      const isStomp = player.vy > 1.2 && (player.y + player.h <= this.y + 7);
      if (isStomp) {
        this.alive = false;
        this.squashTimer = 30; // 0.5s defeated animation
        player.vy = -7.5; // Bounce up!
        parts.burst(this.x + this.w / 2, this.y + this.h / 2, '#D4AF37', 16);
        SFX.jump();
        SFX.correct();
        if (onScore) onScore(40);
      } else if (player.invFrames <= 0) {
        // Player bumped from side or front -> reliably deals damage!
        player.damage(15);
        player.vy = -4.5;
        player.vx = (player.cx < this.x + this.w / 2 ? -4 : 4);
        this.dir = -this.dir;
        parts.burst(player.cx, player.cy, '#ef4444', 12);
        SFX.wrong();
      }
    }
  }

  draw(ctx, cam) {
    if (this.squashTimer <= 0 && !this.alive) return;
    if (!cam.sees(this.x, this.y, this.w, this.h)) return;
    const { x: sx, y: sy } = cam.toS(this.x, this.y);

    ctx.save();
    if (!this.alive) {
      // Defeated / squashed terracotta idol - keeps the face visible!
      const squashH = 12;
      const squashY = sy + (this.h - squashH);

      // Squashed body
      ctx.fillStyle = '#6b361a';
      ctx.strokeStyle = '#3e1a0b';
      ctx.lineWidth = 1;
      rrect(ctx, sx + 1, squashY, this.w - 2, squashH, 2);
      ctx.fill(); ctx.stroke();

      // Defeated 'x x' eyes
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      // Left eye X
      ctx.beginPath();
      ctx.moveTo(sx + 5, squashY + 3); ctx.lineTo(sx + 9, squashY + 7);
      ctx.moveTo(sx + 9, squashY + 3); ctx.lineTo(sx + 5, squashY + 7);
      // Right eye X
      ctx.moveTo(sx + 15, squashY + 3); ctx.lineTo(sx + 19, squashY + 7);
      ctx.moveTo(sx + 19, squashY + 3); ctx.lineTo(sx + 15, squashY + 7);
      ctx.stroke();

      // Faded flattened crown
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(sx + 7, squashY - 2, 10, 2);
    } else {
      const bob = Math.round(Math.sin(Date.now() * 0.008) * 1.5);
      // Ancient Terracotta Sentinel Mask/Idol
      ctx.fillStyle = '#8B4513';
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 1;
      rrect(ctx, sx + 2, sy + bob, this.w - 4, this.h - 2, 4);
      ctx.fill(); ctx.stroke();

      // Crown / headdress ridges
      ctx.fillStyle = '#C2593F';
      ctx.fillRect(sx + 5, sy - 2 + bob, 4, 3);
      ctx.fillRect(sx + 10, sy - 3 + bob, 4, 4);
      ctx.fillRect(sx + 15, sy - 2 + bob, 4, 3);

      // Glowing Ruby Eyes (sharp integer pixels)
      ctx.fillStyle = '#ef4444';
      const eyeOff = this.dir === 1 ? 2 : 0;
      ctx.fillRect(sx + 5 + eyeOff, sy + 7 + bob, 4, 4);
      ctx.fillRect(sx + 13 + eyeOff, sy + 7 + bob, 4, 4);

      // Gold tooth / mouth slit
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(sx + 8, sy + 15 + bob, 8, 2);

      // Feet
      ctx.fillStyle = '#3E2F26';
      const step = Math.round(Math.sin(Date.now() * 0.012) * 2);
      ctx.fillRect(sx + 3, sy + this.h - 3 + step, 6, 4);
      ctx.fillRect(sx + 15, sy + this.h - 3 - step, 6, 4);
    }
    ctx.restore();
  }
}

/* ─────────────────────────────────────────────────────────────
   §4d  MYSTERY BLOCKS (Super Mario ? Blocks)
───────────────────────────────────────────────────────────── */
class MysteryBlock {
  constructor(data) {
    this.id = data.id;
    this.x = data.x;
    this.y = data.y;
    this.w = 24;
    this.h = 24;
    this.reward = data.reward || 50;
    this.opened = false;
    this.bumpY = 0;
    this.coinY = 0;
    this.coinTimer = 0;
  }

  update(dt = 1, player, parts, onScore) {
    // Settle bump animation
    if (this.bumpY < 0) {
      this.bumpY += 1.5 * dt;
      if (this.bumpY > 0) this.bumpY = 0;
    }

    // Animate pop-out coin
    if (this.coinTimer > 0) {
      this.coinTimer -= dt;
      this.coinY -= 2 * dt;
    }

    // Head-bump collision from below:
    // Player is moving upward and player head intersects bottom of block
    if (
      player.vy < 0 &&
      player.x + player.w > this.x + 3 &&
      player.x < this.x + this.w - 3 &&
      player.y <= this.y + this.h + 6 &&
      player.y >= this.y + this.h - 8
    ) {
      this.bumpY = -6; // Hop up
      player.vy = 1;   // Rebound down

      if (!this.opened) {
        this.opened = true;
        this.coinY = this.y - 10;
        this.coinTimer = 30;
        parts.burst(this.x + this.w / 2, this.y, '#D4AF37', 16);
        SFX.discover();
        if (onScore) onScore(this.reward);
      } else {
        SFX.land();
      }
    }
  }

  draw(ctx, cam) {
    if (!cam.sees(this.x, this.y - 30, this.w, this.h + 30)) return;
    const { x: sx, y: sy } = cam.toS(this.x, this.y + this.bumpY);

    ctx.save();
    if (!this.opened) {
      // Golden Glowing Super Mario ? Block
      ctx.fillStyle = '#E5A93C';
      ctx.strokeStyle = '#8B5A18';
      ctx.lineWidth = 2;
      rrect(ctx, sx, sy, this.w, this.h, 4);
      ctx.fill(); ctx.stroke();

      // Ornate inner border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      rrect(ctx, sx + 2, sy + 2, this.w - 4, this.h - 4, 2);
      ctx.stroke();

      // Corner rivets
      ctx.fillStyle = '#6E4510';
      ctx.fillRect(sx + 3, sy + 3, 2, 2);
      ctx.fillRect(sx + this.w - 5, sy + 3, 2, 2);
      ctx.fillRect(sx + 3, sy + this.h - 5, 2, 2);
      ctx.fillRect(sx + this.w - 5, sy + this.h - 5, 2, 2);

      // Question Mark ? (with high contrast dark shadow)
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#3E2405';
      ctx.fillText('?', sx + this.w / 2 + 1, sy + this.h / 2 + 1.5);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('?', sx + this.w / 2, sy + this.h / 2 + 0.5);
    } else {
      // Inert dark stone block
      ctx.fillStyle = '#4A3B32';
      ctx.strokeStyle = '#2E241E';
      ctx.lineWidth = 1.5;
      rrect(ctx, sx, sy, this.w, this.h, 3);
      ctx.fill(); ctx.stroke();
    }

    // Floating Coin popup
    if (this.coinTimer > 0) {
      const { x: cx, y: cy } = cam.toS(this.x + this.w / 2, this.coinY);
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 7px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', cx, cy);
    }
    ctx.restore();
  }
}

/* ─────────────────────────────────────────────────────────────
   §5  PARTICLE SYSTEM
───────────────────────────────────────────────────────────── */
class Particles {
  constructor() { this.list = []; }

  burst(x, y, color, n = 10) {
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i / n) + Math.random() * 0.6;
      const s = 1.4 + Math.random() * 2.4;
      this.list.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 1.8,
        life: 1,
        decay: 0.028 + Math.random() * 0.022,
        r: 2 + Math.random() * 3,
        color,
      });
    }
  }

  update(dt = 1) {
    this.list = this.list.filter(p => {
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.vy += 0.09 * dt;
      p.life -= p.decay * dt;
      return p.life > 0;
    });
  }

  draw(ctx) {
    this.list.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
}

/* ─────────────────────────────────────────────────────────────
   §6  BACKGROUND (parallax sky, hills, clouds)
───────────────────────────────────────────────────────────── */
function drawBackground(ctx, camX) {
  // Sky gradient — warm Nusantara dusk
  const sky = ctx.createLinearGradient(0, 0, 0, V_H);
  sky.addColorStop(0,   '#C8956C');
  sky.addColorStop(0.3, '#E8C99A');
  sky.addColorStop(0.65,'#F5EFDC');
  sky.addColorStop(1,   '#DDD0BC');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, V_W, V_H);

  // Sun/moon glow
  const sunX = V_W * 0.72 - camX * 0.04;
  const sunGrad = ctx.createRadialGradient(sunX, 68, 4, sunX, 68, 52);
  sunGrad.addColorStop(0, 'rgba(255,230,160,0.9)');
  sunGrad.addColorStop(0.45, 'rgba(255,190,80,0.55)');
  sunGrad.addColorStop(1, 'rgba(255,140,40,0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, 68, 52, 0, Math.PI * 2);
  ctx.fill();

  // Distant mountain silhouettes (layer 1 — very slow)
  ctx.fillStyle = 'rgba(150, 100, 60, 0.22)';
  ctx.beginPath();
  ctx.moveTo(0, V_H);
  for (let x = 0; x <= V_W; x += 20) {
    const wx = x + camX * 0.06;
    ctx.lineTo(x, 155 + Math.sin(wx * 0.007) * 40 + Math.cos(wx * 0.013) * 20);
  }
  ctx.lineTo(V_W, V_H);
  ctx.fill();

  // Mid hills (layer 2)
  ctx.fillStyle = 'rgba(110, 85, 50, 0.3)';
  ctx.beginPath();
  ctx.moveTo(0, V_H);
  for (let x = 0; x <= V_W; x += 14) {
    const wx = x + camX * 0.14;
    ctx.lineTo(x, 190 + Math.sin(wx * 0.009) * 32 + Math.cos(wx * 0.017) * 14);
  }
  ctx.lineTo(V_W, V_H);
  ctx.fill();

  // Clouds (mega-mendung inspired curls)
  const cloudPositions = [
    { ox: 60,  oy: 42, r: 18, spd: 0.06 },
    { ox: 210, oy: 62, r: 22, spd: 0.07 },
    { ox: 400, oy: 30, r: 14, spd: 0.055 },
    { ox: 560, oy: 50, r: 20, spd: 0.065 },
    { ox: 730, oy: 38, r: 16, spd: 0.06  },
  ];
  cloudPositions.forEach(c => {
    const cx = ((c.ox - camX * c.spd) % (V_W + 80) + V_W + 80) % (V_W + 80) - 40;
    ctx.fillStyle = 'rgba(255,250,230,0.42)';
    ctx.beginPath();
    ctx.arc(cx,            c.oy,         c.r,        0, Math.PI * 2);
    ctx.arc(cx + c.r * 1.4, c.oy - c.r * 0.4, c.r * 1.25, 0, Math.PI * 2);
    ctx.arc(cx + c.r * 2.8, c.oy,         c.r * 0.9,  0, Math.PI * 2);
    ctx.fill();
  });

  // Silhouette candi / stupa in far bg (layer 3)
  ctx.fillStyle = 'rgba(80,54,30,0.28)';
  for (let i = 0; i < 6; i++) {
    const bx = ((i * 420 - camX * 0.22) % (V_W + 200) + V_W + 200) % (V_W + 200) - 80;
    _bgStupa(ctx, bx, 205);
  }

  // Ground fog at bottom
  const fog = ctx.createLinearGradient(0, V_H * 0.72, 0, V_H);
  fog.addColorStop(0, 'rgba(220,200,165,0)');
  fog.addColorStop(1, 'rgba(200,175,140,0.3)');
  ctx.fillStyle = fog;
  ctx.fillRect(0, 0, V_W, V_H);
}

function _bgStupa(ctx, x, y) {
  ctx.fillRect(x,     y + 22, 58, 58);
  ctx.fillRect(x + 8, y + 4,  42, 18);
  ctx.fillRect(x + 20,y - 12, 18, 16);
  ctx.fillRect(x + 28,y - 24, 4,  12);
}

/* ─────────────────────────────────────────────────────────────
   §7  CAMERA
───────────────────────────────────────────────────────────── */
class Camera {
  constructor() {
    this.x = 0; this._tx = 0;
    this.shakeAmt = 0; this._sx = 0; this._sy = 0;
  }
  follow(px, worldW) {
    this._tx = px - V_W * 0.38;
    this.x  += (this._tx - this.x) * 0.10;
    this.x   = Math.max(0, Math.min(worldW - V_W, this.x));
  }
  shake(mag) { this.shakeAmt = Math.max(this.shakeAmt, mag); }
  tick() {
    if (this.shakeAmt > 0.15) {
      this._sx = (Math.random() - 0.5) * this.shakeAmt;
      this._sy = (Math.random() - 0.5) * this.shakeAmt;
      this.shakeAmt *= 0.72;
    } else { this._sx = 0; this._sy = 0; this.shakeAmt = 0; }
  }
  toS(wx, wy) { return { x: Math.round(wx - this.x + this._sx), y: Math.round(wy + this._sy) }; }
  sees(wx, wy, w, h) { return wx - this.x + w > -20 && wx - this.x < V_W + 20 && wy + h > 0 && wy < V_H; }
}

/* ─────────────────────────────────────────────────────────────
   §8  PLAYER
───────────────────────────────────────────────────────────── */
class Player {
  constructor() {
    this.x = 60; this.y = 220;
    this.w = 22; this.h = 42;
    this.vx = 0; this.vy = 0;
    this.grounded = false;
    this.facing   = 1;    // 1=right -1=left
    this.isMoving = false;
    this.hp = 100; this.maxHp = 100;
    this.invFrames = 0;
    // Anim
    this.state = 'idle';
    this.frame = 0;
    this.animTick = 0;
    this._stepT = 0;
    // Interact
    this.interacting = false;
    this.interactTimer = 0;
  }

  reset() {
    this.x = 60; this.y = 220; this.vx = 0; this.vy = 0;
    this.hp = this.maxHp; this.invFrames = 0;
    this.state = 'idle'; this.frame = 0;
  }

  update(keys, dt = 1) {
    // Interact anim lock
    if (this.interactTimer > 0) {
      this.interactTimer -= dt;
      this.interacting = true;
      this.state = 'interact';
      this.vx = 0;
      this._gravity(dt);
      this._anim(SPRITE.interact.frames, SPRITE.interact.fps, dt);
      if (this.invFrames > 0) this.invFrames -= dt;
      return;
    }
    this.interacting = false;

    // Horizontal
    if (keys.left)  { this.vx = -WORLD_CONFIG.playerSpeed; this.facing = -1; this.isMoving = true; }
    else if (keys.right) { this.vx = WORLD_CONFIG.playerSpeed; this.facing = 1; this.isMoving = true; }
    else { this.vx = 0; this.isMoving = false; }

    // Jump
    if (keys.jump && this.grounded) {
      this.vy = WORLD_CONFIG.jumpForce;
      this.grounded = false;
      SFX.jump();
    }
    // Short-hop release
    if (!keys.jump && this.vy < -3.5) this.vy += 0.55 * dt;

    this._gravity(dt);

    // State
    const prevState = this.state;
    if (!this.grounded) this.state = this.vy < 0 ? 'jump' : 'fall';
    else if (this.isMoving) this.state = 'walk';
    else this.state = 'idle';

    if (this.state !== prevState) {
      this.frame = 0;
      this.animTick = 0;
    }

    // Footsteps
    if (this.state === 'walk') {
      if ((this._stepT += dt) >= 19) { SFX.step(); this._stepT = 0; }
    } else this._stepT = 0;

    // Anim
    const aMap = { idle: SPRITE.idle, walk: SPRITE.walk, jump: SPRITE.jump, fall: SPRITE.fall, interact: SPRITE.interact };
    const a = aMap[this.state] || SPRITE.idle;
    this._anim(a.frames, a.fps, dt);

    if (this.invFrames > 0) this.invFrames -= dt;

    // World bounds
    if (this.x < 8) { this.x = 8; this.vx = 0; }
    if (this.x + this.w > WORLD_CONFIG.width - 8) { this.x = WORLD_CONFIG.width - 8 - this.w; }
    if (this.y > V_H + 80) {
      this.damage(25);
      this.x = 60; this.y = 120; this.vy = 0;
    }
  }

  damage(amt) {
    if (this.invFrames > 0) return false;
    this.hp = Math.max(0, this.hp - amt);
    this.invFrames = 50;
    return true;
  }

  _gravity(dt = 1) {
    const wasG = this.grounded;
    this.vy += WORLD_CONFIG.gravity * dt;
    this.x  += this.vx * dt;
    this.y  += this.vy * dt;
    this.grounded = false;

    PLATFORMS.forEach(p => {
      if (
        this.x + this.w > p.x && this.x < p.x + p.w &&
        this.y + this.h >= p.y && this.y + this.h <= p.y + p.h + 15 &&
        this.vy >= 0
      ) {
        this.y = p.y - this.h;
        this.vy = 0;
        this.grounded = true;
      }
    });

    if (typeof MYSTERY_BLOCKS !== 'undefined') {
      MYSTERY_BLOCKS.forEach(b => {
        if (
          this.x + this.w > b.x && this.x < b.x + b.w &&
          this.y + this.h >= b.y && this.y + this.h <= b.y + b.h + 15 &&
          this.vy >= 0
        ) {
          this.y = b.y - this.h;
          this.vy = 0;
          this.grounded = true;
        }
      });
    }

    if (!wasG && this.grounded) SFX.land();
  }

  _anim(maxFrames, fps, dt = 1) {
    this.animTick += dt;
    if (this.animTick >= fps) {
      this.frame = (this.frame + 1) % maxFrames;
      this.animTick = 0;
    }
  }

  triggerInteract() { this.interactTimer = 30; this.frame = 0; this.animTick = 0; }

  draw(ctx, cam, mascootImg, offsetY = 0) {
    if (offsetY >= 44) return; // fully submerged into sacred ground pipe
    const { x: sx, y: sy } = cam.toS(this.x, this.y + offsetY);

    // Blink when invulnerable
    if (this.invFrames > 0 && Math.floor(Date.now() / 75) % 2 === 0) return;

    ctx.save();
    // Anchor directly at feet center for perfectly grounded, jitter-free animation
    ctx.translate(sx + this.w / 2, sy + this.h);
    if (this.facing === -1) ctx.scale(-1, 1);

    if (mascootImg && typeof SPRITE_FRAMES !== 'undefined') {
      const frames = SPRITE_FRAMES[this.state] || SPRITE_FRAMES.idle;
      const fIdx = Math.min(this.frame, frames.length - 1);
      const fr = frames[fIdx];
      // Proportional scale: maps natural mascot height (140px) to 44px on canvas
      const scale = 44 / 140;
      const dw = Math.round(fr.sw * scale);
      const dh = Math.round(fr.sh * scale);

      ctx.drawImage(
        mascootImg,
        fr.sx, fr.sy, fr.sw, fr.sh,
        -Math.round(dw / 2), -dh, dw, dh
      );
    } else {
      ctx.translate(-this.w / 2, -this.h);
      _drawPixelPlayer(ctx, this.state, this.frame);
    }

    ctx.restore();

    // Shadow at feet (only when walking on ground, not submerged)
    if (offsetY <= 0) {
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = '#1a1008';
      ctx.beginPath();
      ctx.ellipse(sx + this.w / 2, sy + this.h, this.w * 0.45, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  get cx() { return this.x + this.w / 2; }
  get cy() { return this.y + this.h / 2; }
}

function _drawPixelPlayer(ctx, state, frame) {
  const legOff = state === 'walk' ? Math.sin(frame * 1.2) * 4 : 0;
  ctx.fillStyle = '#606C38'; ctx.fillRect(-5, 11, 5, 14);          // backpack
  ctx.fillStyle = '#3E2F26';
  ctx.fillRect(3, 28 + legOff, 5, 9);
  ctx.fillRect(14, 28 - legOff, 5, 9);
  ctx.fillStyle = '#8B1D3B'; ctx.fillRect(3, 20, 18, 10);          // jarik
  ctx.fillStyle = '#D4AF37'; ctx.fillRect(5, 22, 14, 2); ctx.fillRect(4, 26, 16, 2);
  ctx.fillStyle = '#FAF6F0'; ctx.fillRect(4, 9, 16, 12);           // shirt
  ctx.fillStyle = '#4A3B32'; ctx.fillRect(3, 19, 18, 3);           // belt
  ctx.fillStyle = '#E0A96D'; ctx.fillRect(6, 1, 13, 10);           // head
  ctx.fillStyle = '#2E241E'; ctx.fillRect(14, 4, 2, 3);            // eye
  ctx.fillStyle = '#8B4513'; ctx.fillRect(5, -1, 14, 4);           // udeng
  ctx.fillStyle = '#D4AF37'; ctx.fillRect(17, 0, 4, 3);
  ctx.fillStyle = '#E0A96D';
  ctx.fillRect(18, state === 'jump' ? 2 : 11, 4, 9);               // arm
}

/* ─────────────────────────────────────────────────────────────
   §9  ARTIFACT SPRITE (floating pickup)
───────────────────────────────────────────────────────────── */
class ArtifactPickup {
  constructor(data) {
    this.data = data;
    this.x = data.worldX;
    this.y = data.worldY;
    this.w = 46; this.h = 46;
    this._ph = Math.random() * Math.PI * 2;  // phase for float
  }

  get discovered() { return this.data.discovered; }

  _floatY() { return this.y + Math.sin(Date.now() * 0.0025 + this._ph) * 5.5; }

  isNear(player, radius = 56) {
    const dx = player.cx - (this.x + this.w / 2);
    const dy = player.cy - (this._floatY() + this.h / 2);
    return Math.hypot(dx, dy) < radius;
  }

  draw(ctx, cam, artImg) {
    const fy = this._floatY();
    if (!cam.sees(this.x, fy, this.w, this.h)) return;
    const { x: sx, y: sy } = cam.toS(this.x, fy);
    const cx = sx + this.w / 2, cy = sy + this.h / 2;
    const t = Date.now() * 0.004;

    ctx.save();

    // 1. Aura glow
    const glowR = 24 + Math.sin(t * 2.2) * 4;
    const auraColor = this.discovered ? '#D4AF37' : this.data.accentColor;
    const grd = ctx.createRadialGradient(cx, cy, 3, cx, cy, glowR);
    grd.addColorStop(0, auraColor + 'B0');
    grd.addColorStop(1, auraColor + '00');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
    ctx.fill();

    // 2. Shadow beneath
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(cx, sy + this.h + 3, this.w * 0.4, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // 3. Artifact image (PNG with transparency)
    if (artImg) {
      ctx.drawImage(artImg, sx, sy, this.w, this.h);
    } else {
      // Fallback box
      ctx.fillStyle = '#FAF6F0';
      ctx.strokeStyle = this.data.accentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      rrect(ctx, sx + 2, sy + 2, this.w - 4, this.h - 4, 6);
      ctx.fill(); ctx.stroke();
      ctx.font = '18px serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(this.data.iconEmoji, cx, cy);
    }

    // 4. Sparkles around undiscovered artifacts
    if (!this.discovered) {
      for (let i = 0; i < 3; i++) {
        const ang = t * 1.5 + (i * Math.PI * 2 / 3) + this._ph;
        const r = glowR * 0.78;
        const px = cx + Math.cos(ang) * r;
        const py = cy + Math.sin(ang) * r;
        const a = 0.4 + 0.4 * Math.sin(t * 3 + i);
        ctx.globalAlpha = a;
        ctx.fillStyle = '#D4AF37';
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // 5. Discovered badge
    if (this.discovered) {
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(sx + this.w - 4, sy + 4, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 7px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('✓', sx + this.w - 4, sy + 4);
    }

    // 6. Item name label (small, floats above)
    if (!this.discovered) {
      ctx.globalAlpha = 0.7 + 0.3 * Math.sin(t * 2);
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 3;
      ctx.font = 'bold 7px "Inter", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText(this.data.name, cx, sy - 3);
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }

    ctx.restore();
  }
}

/* ─────────────────────────────────────────────────────────────
   §10  IN-CANVAS TEXTBOX DIALOG SYSTEM
   Draws the ornate textbox.png frame on the canvas with
   animated text, quiz, and XP reward — no DOM modal needed.
───────────────────────────────────────────────────────────── */
class TextboxDialog {
  constructor() {
    this.active      = false;
    this.artifact    = null;
    this._page       = 0;      // 0 = lore pages, 1 = quiz
    this._dialogLine = 0;      // current line being revealed
    this._charIdx    = 0;      // typewriter char index
    this._typeTimer  = 0;
    this._quizDone   = false;
    this._selectedOpt = -1;
    this._correct    = false;
    this._xpAwarded  = false;
    this._fadeIn     = 0;      // 0..1 for open animation
    this._shakeT     = 0;
    this._waitTimer  = 0;      // auto-advance timer after quiz
    this.onClose     = null;   // callback
    this.onAnswer    = null;   // callback when answering quiz
  }

  open(artifact, onClose, onAnswer) {
    this.artifact     = artifact;
    this.active       = true;
    this._page        = 0;
    this._dialogLine  = 0;
    this._charIdx     = 0;
    this._typeTimer   = 0;
    this._quizDone    = false;
    this._selectedOpt = -1;
    this._correct     = false;
    this._xpAwarded   = false;
    this._fadeIn      = 0;
    this._shakeT      = 0;
    this._waitTimer   = 0;
    this.onClose      = onClose;
    this.onAnswer     = onAnswer;
    SFX.chat();
  }

  close() {
    this.active = false;
    this.artifact = null;
    if (this.onClose) this.onClose();
  }

  // Called when player presses E / interact to advance dialog
  advance() {
    if (!this.active) return;

    if (this._page === 0) {
      const lines = this.artifact.dialog;
      // If typewriter not done — skip to end of line
      if (this._charIdx < lines[this._dialogLine].length) {
        this._charIdx = lines[this._dialogLine].length;
        return;
      }
      // Advance to next line
      this._dialogLine++;
      SFX.chat();
      if (this._dialogLine >= lines.length) {
        // Move to quiz page
        this._page = 1;
        this._dialogLine = 0;
        this._charIdx = 0;
        this._typeTimer = 0;
      } else {
        this._charIdx = 0;
        this._typeTimer = 0;
      }
    }
    // On quiz page — advance only closes (after answering)
    else if (this._page === 1 && this._quizDone) {
      this.close();
    }
  }

  selectQuizOpt(i) {
    if (!this.active || this._page !== 1 || this._quizDone) return;
    this._selectedOpt = i;
    this._correct = (i === this.artifact.quiz.correct);
    this._quizDone = true;
    if (this._correct) SFX.correct();
    else SFX.wrong();
    if (this.onAnswer) this.onAnswer(this._correct);
  }

  update() {
    if (!this.active) return;

    // Fade in
    if (this._fadeIn < 1) { this._fadeIn = Math.min(1, this._fadeIn + 0.07); }

    // Typewriter
    if (this._page === 0) {
      const lines = this.artifact.dialog;
      const curLine = lines[this._dialogLine] || '';
      if (this._charIdx < curLine.length) {
        if (++this._typeTimer >= 2) {
          this._charIdx++;
          this._typeTimer = 0;
        }
      }
    }
  }

  _layout() {
    // Precise frame bbox inside textbox-removebg-preview.png: sx=101, sy=104, sw=466, sh=205
    const BOX_W = 480;
    const BOX_H = Math.round(BOX_W * 205 / 466); // 211
    const BOX_X = Math.round((V_W - BOX_W) / 2); // 80
    const BOX_Y = Math.round((V_H - BOX_H) / 2); // 74

    // Interior cream parchment inside the ornate wooden borders
    const INNER_X = BOX_X + 46; // 126
    const INNER_Y = BOX_Y + 37; // 111
    const INNER_W = 382;
    const INNER_H = 135;

    const ICON_SIZE = 48;
    const ICON_X = INNER_X + 6;  // 132
    const ICON_Y = INNER_Y + 26; // 137

    const TEXT_X = ICON_X + ICON_SIZE + 10; // 190
    const TEXT_W = INNER_X + INNER_W - TEXT_X - 6; // 312

    const CONTENT_Y = INNER_Y + 25; // 136
    const OPT_H = 15;
    const OPT_GAP = 3;
    const OPT_Y_START = CONTENT_Y + 16; // 152

    return {
      BOX_X, BOX_Y, BOX_W, BOX_H,
      INNER_X, INNER_Y, INNER_W, INNER_H,
      ICON_SIZE, ICON_X, ICON_Y,
      TEXT_X, TEXT_W,
      CONTENT_Y, OPT_H, OPT_GAP, OPT_Y_START
    };
  }

  /**
   * Draw the textbox on canvas.
   * Displays as a rich centered Nusantara artifact parchment card perfectly
   * framed by the wooden border with no clipped or floating text.
   */
  draw(ctx, tbImg, artImg) {
    if (!this.active) return;

    const alpha = this._fadeIn;
    const L = this._layout();

    ctx.save();
    ctx.globalAlpha = alpha;

    // 1. Semi-transparent dark cinematic backdrop behind the dialog card
    ctx.fillStyle = 'rgba(15, 10, 6, 0.72)';
    ctx.fillRect(0, 0, V_W, V_H);

    // 2. Solid warm parchment background under the frame (eliminates any bleed)
    ctx.fillStyle = '#EFE4CD';
    ctx.beginPath();
    rrect(ctx, L.INNER_X - 2, L.INNER_Y - 2, L.INNER_W + 4, L.INNER_H + 4, 4);
    ctx.fill();

    // 3. Draw textbox frame cropped exactly from PNG source (sx=101, sy=104, sw=466, sh=205)
    if (tbImg) {
      ctx.drawImage(tbImg, 101, 104, 466, 205, L.BOX_X, L.BOX_Y, L.BOX_W, L.BOX_H);
    } else {
      ctx.fillStyle = '#241a12';
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.beginPath();
      rrect(ctx, L.BOX_X, L.BOX_Y, L.BOX_W, L.BOX_H, 10);
      ctx.fill(); ctx.stroke();
    }

    // 4. Header: Title & Origin badge inside the top parchment margin
    ctx.font = 'bold 11px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#3E2211';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(this.artifact.name, L.INNER_X + 6, L.INNER_Y + 4);

    ctx.font = 'bold 7.5px "Inter", sans-serif';
    ctx.fillStyle = '#8B3A0E';
    ctx.textAlign = 'right';
    ctx.fillText(`${this.artifact.category.toUpperCase()} · ${this.artifact.origin.toUpperCase()}`, L.INNER_X + L.INNER_W - 6, L.INNER_Y + 6);

    // Decorative divider line
    ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
    ctx.fillRect(L.INNER_X + 6, L.INNER_Y + 20, L.INNER_W - 12, 1);

    // 5. Artifact Icon / Preview on left
    ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
    ctx.beginPath();
    rrect(ctx, L.ICON_X, L.ICON_Y, L.ICON_SIZE, L.ICON_SIZE, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(139, 69, 19, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    if (artImg) {
      ctx.drawImage(artImg, L.ICON_X + 3, L.ICON_Y + 3, L.ICON_SIZE - 6, L.ICON_SIZE - 6);
    } else {
      ctx.font = 'bold 12px "Cinzel", serif';
      ctx.fillStyle = '#8B3A0E';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.artifact.name.substring(0, 2).toUpperCase(), L.ICON_X + L.ICON_SIZE / 2, L.ICON_Y + L.ICON_SIZE / 2);
    }

    // Cultural verification badge under icon
    ctx.font = 'bold 6.5px "Inter", sans-serif';
    ctx.fillStyle = '#2D5A27';
    ctx.textAlign = 'center';
    ctx.fillText('TERVERIFIKASI', L.ICON_X + L.ICON_SIZE / 2, L.ICON_Y + L.ICON_SIZE + 9);

    // 6. Page Content (Lore vs Quiz)
    const contentY = L.CONTENT_Y;

    if (this._page === 0) {
      // ── LORE PAGE ──
      const lines = this.artifact.dialog;
      const curLine = (lines[this._dialogLine] || '').substring(0, this._charIdx);

      ctx.font = '9px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      // Previous lines (softer contrast)
      for (let i = 0; i < this._dialogLine; i++) {
        ctx.globalAlpha = alpha * 0.55;
        ctx.fillStyle = '#5A4232';
        ctx.fillText(lines[i], L.TEXT_X, contentY + i * 16);
      }

      // Current line (active crisp dark text)
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#1A0E05';
      ctx.fillText(curLine, L.TEXT_X, contentY + this._dialogLine * 16);

      // Footer: Page indicator + Advance button
      const footerY = L.INNER_Y + L.INNER_H - 10;
      ctx.globalAlpha = alpha * 0.75;
      ctx.fillStyle = '#6E543E';
      ctx.font = '7.5px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Bagian ${this._dialogLine + 1} dari ${lines.length}`, L.TEXT_X, footerY);

      if (this._charIdx >= (lines[this._dialogLine] || '').length) {
        const arrowAlpha = Math.abs(Math.sin(Date.now() * 0.005));
        ctx.globalAlpha = alpha * (0.65 + 0.35 * arrowAlpha);
        ctx.fillStyle = '#8B3A0E';
        ctx.font = 'bold 8.5px "Inter", sans-serif';
        ctx.textAlign = 'right';
        const isLast = this._dialogLine >= lines.length - 1;
        ctx.fillText(isLast ? 'Mulai Kuis [ E ] ▶' : 'Lanjut [ E ] ▶', L.INNER_X + L.INNER_W - 6, footerY);
      }

    } else {
      // ── QUIZ PAGE ──
      ctx.font = 'bold 8.5px "Inter", sans-serif';
      ctx.fillStyle = '#2E1F10';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(this.artifact.quiz.question, L.TEXT_X, contentY);

      const opts = this.artifact.quiz.options;
      const optYStart = L.OPT_Y_START;
      const optH = L.OPT_H;
      const optGap = L.OPT_GAP;

      opts.forEach((opt, i) => {
        const oy = optYStart + i * (optH + optGap);
        const ox = L.TEXT_X;
        const ow = L.TEXT_W;

        let bg = 'rgba(255, 252, 245, 0.9)';
        let border = '#C8B49A';
        let text = '#2E1F10';

        if (this._quizDone) {
          if (i === this.artifact.quiz.correct) {
            bg = '#DCFCE7'; border = '#16a34a'; text = '#14532d';
          } else if (i === this._selectedOpt) {
            bg = '#FEE2E2'; border = '#dc2626'; text = '#7f1d1d';
          } else {
            bg = 'rgba(230, 220, 205, 0.45)'; border = '#D4C5B0'; text = '#8C7760';
          }
        }

        ctx.fillStyle = bg;
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        rrect(ctx, ox, oy, ow, optH, 4);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = text;
        ctx.font = '7.5px "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const label = String.fromCharCode(65 + i) + '. ' + opt;
        ctx.fillText(label, ox + 6, oy + optH / 2);
      });

      // Quiz footer
      const footerY = L.INNER_Y + L.INNER_H - 10;
      if (this._quizDone) {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this._correct ? '#16a34a' : '#DC2626';
        ctx.font = 'bold 8px "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(
          this._correct
            ? `Jawaban Benar! +${this.artifact.quiz.xp} XP Budaya ditambahkan.`
            : `Jawaban Kurang Tepat. Vitalitas berkurang 20 HP.`,
          L.TEXT_X, footerY
        );

        ctx.fillStyle = '#8B3A0E';
        ctx.font = 'bold 8.5px "Inter", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('[ E ] Selesai & Tutup ▶', L.INNER_X + L.INNER_W - 6, footerY);
      } else {
        ctx.globalAlpha = alpha * 0.75;
        ctx.fillStyle = '#6E543E';
        ctx.font = '7.5px "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Klik jawaban atau tekan angka 1-4', L.TEXT_X, footerY);
      }
    }

    ctx.restore();
  }

  /**
   * Returns which quiz option was clicked on canvas, or -1 if none.
   */
  getClickedOption(cx, cy, tbImg) {
    if (!this.active || this._page !== 1 || this._quizDone) return -1;
    const L = this._layout();
    const opts = this.artifact.quiz.options;

    for (let i = 0; i < opts.length; i++) {
      const ox = L.TEXT_X;
      const oy = L.OPT_Y_START + i * (L.OPT_H + L.OPT_GAP);
      const ow = L.TEXT_W;
      const oh = L.OPT_H;
      if (cx >= ox && cx <= ox + ow && cy >= oy && cy <= oy + oh) {
        return i;
      }
    }
    return -1;
  }

  // Check if clicking advance arrow (lore page)
  isAdvanceArraClick(cx, cy) {
    if (!this.active) return false;
    const L = this._layout();
    return cx >= L.INNER_X && cx <= L.INNER_X + L.INNER_W && cy >= L.INNER_Y && cy <= L.INNER_Y + L.INNER_H;
  }
}

/* ─────────────────────────────────────────────────────────────
   §11  MINIMAP BAR
───────────────────────────────────────────────────────────── */
function drawMinimap(ctx, player, sprites) {
  const BAR_X = 24, BAR_Y = V_H - 9, BAR_W = V_W - 48, BAR_H = 4;

  ctx.fillStyle = 'rgba(20,14,8,0.55)';
  ctx.beginPath();
  rrect(ctx, BAR_X, BAR_Y, BAR_W, BAR_H, 3);
  ctx.fill();

  const pct = player.x / WORLD_CONFIG.width;
  ctx.fillStyle = '#D4AF37';
  ctx.beginPath();
  rrect(ctx, BAR_X, BAR_Y, Math.max(3, BAR_W * pct), BAR_H, 3);
  ctx.fill();

  // Artifact dots
  sprites.forEach(sp => {
    const ax = BAR_X + (sp.data.worldX / WORLD_CONFIG.width) * BAR_W;
    ctx.fillStyle = sp.discovered ? '#22c55e' : '#C2593F';
    ctx.beginPath();
    ctx.arc(ax, BAR_Y + BAR_H / 2, sp.discovered ? 4 : 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Player dot
  ctx.fillStyle = '#FAF6F0';
  ctx.shadowColor = '#000'; ctx.shadowBlur = 2;
  ctx.beginPath();
  ctx.arc(BAR_X + pct * BAR_W, BAR_Y + BAR_H / 2, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

/* ─────────────────────────────────────────────────────────────
   §12  GAME CONTROLLER
───────────────────────────────────────────────────────────── */
class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx    = this.canvas.getContext('2d');
    this.canvas.width  = V_W;
    this.canvas.height = V_H;

    this.state = {
      score: 0,
      found: 0,
      total: ARTIFACTS.length,
      hp: 100, maxHp: 100,
      zone: '',
    };

    this.loader  = new Loader();
    this.cam     = new Camera();
    this.parts   = new Particles();
    this.tiles   = new TileRenderer();
    this.player  = new Player();
    this.dialog  = new TextboxDialog();
    this.sprites = ARTIFACTS.map(a => new ArtifactPickup(a));
    this.hazards = (typeof HAZARDS !== 'undefined' ? HAZARDS : []).map(h => new Hazard(h));
    this.enemies = (typeof ENEMIES !== 'undefined' ? ENEMIES : []).map(e => new Sentinel(e));
    this.mysteryBlocks = (typeof MYSTERY_BLOCKS !== 'undefined' ? MYSTERY_BLOCKS : []).map(m => new MysteryBlock(m));
    this.victoryState = {
      active: false,
      step: 'idle',
      sinkY: 0,
      timer: 0,
      fireworksT: 0,
      fanfarePlayed: false,
      pipePlayed: false,
    };

    this.keys   = { left: false, right: false, jump: false, interact: false };
    this._iLatch = false;
    this._jLatch = false;
    this._near   = null;
    this._lastZone = '';

    this._loadAssets();
    this._animateLoading();
  }

  _animateLoading() {
    this._drawLoading();
    if (this.loader._pending > 0) {
      requestAnimationFrame(() => this._animateLoading());
    }
  }

  _loadAssets() {
    Object.entries(ASSET_PATHS).forEach(([k, v]) => this.loader.load(k, v));
    this.loader.onDone(() => this._start());
  }

  _drawLoading() {
    const ctx = this.ctx;
    ctx.fillStyle = '#2E241E';
    ctx.fillRect(0, 0, V_W, V_H);
    // Loading bar
    const barW = V_W * 0.55, barX = (V_W - barW) / 2;
    ctx.fillStyle = '#4A3B32'; ctx.fillRect(barX, V_H / 2 + 10, barW, 8);
    ctx.fillStyle = '#D4AF37';
    const total = Object.keys(ASSET_PATHS).length;
    const pct = total > 0 ? 1 - this.loader._pending / total : 1;
    ctx.fillRect(barX, V_H / 2 + 10, barW * Math.max(0.08, pct), 8);
    ctx.fillStyle = '#FAF6F0';
    ctx.font = 'bold 13px "Cinzel",serif';
    ctx.textAlign = 'center';
    ctx.fillText('Memuat Pusaka Nusantara...', V_W / 2, V_H / 2);
    ctx.font = '9px "Inter",sans-serif';
    ctx.fillStyle = '#D4AF37';
    ctx.fillText('Harap tunggu sebentar', V_W / 2, V_H / 2 + 28);
  }

  _start() {
    this._bindControls();
    this._uiManager();
    this._updateHUD();
    this._showZoneToast('Pelataran Candi Majapahit — Mulai Petualangan');
    requestAnimationFrame(() => this._loop());
    this._lastTs = 0;
  }

  _loop(ts = 0) {
    requestAnimationFrame(t => this._loop(t));
    const raw = this._lastTs ? (ts - this._lastTs) / 16.667 : 1;
    const dt  = Math.min(raw, 3);
    this._lastTs = ts;
    this._update(dt);
    this._render();
  }

  _update(dt = 1) {
    const dlgOpen = this.dialog.active;

    // Victory sequence check at the end of the world (Super Mario pipe at x >= 3060)
    if (!this.victoryState.active && this.player.x >= 3060) {
      this.victoryState.active = true;
      this.victoryState.step = 'walking';
      this.victoryState.sinkY = 0;
      this.victoryState.timer = 0;
      this.victoryState.fireworksT = 0;
      this.victoryState.fanfarePlayed = false;
      this.victoryState.pipePlayed = false;
    }

    if (this.victoryState.active) {
      this._updateVictory(dt);
      this.cam.follow(this.player.x, WORLD_CONFIG.width);
      this.cam.tick();
      this.parts.update(dt);
      this.dialog.update();
      this._updateHUD();
      return;
    }

    if (!dlgOpen) {
      this.player.update(this.keys, dt);
      this.cam.follow(this.player.x, WORLD_CONFIG.width);

      // Hazards (Spikes) check
      this.hazards.forEach(h => h.checkCollision(this.player, this.parts));

      // Sentinels / Patrolling enemies
      this.enemies.forEach(e => e.update(dt, this.player, this.parts, pts => {
        this.state.score += pts;
        this._updateHUD();
      }));

      // Super Mario ? Mystery Blocks
      this.mysteryBlocks.forEach(m => m.update(dt, this.player, this.parts, pts => {
        this.state.score += pts;
        this._updateHUD();
      }));
    }
    this.cam.tick();
    this.parts.update(dt);
    this.dialog.update();

    // Proximity
    this._near = null;
    this.sprites.forEach(sp => {
      if (!sp.discovered && sp.isNear(this.player)) this._near = sp;
    });

    // Proximity prompt DOM
    const prompt = document.getElementById('proximity-prompt');
    const pname  = document.getElementById('proximity-name');
    if (this._near && !dlgOpen) {
      pname.textContent = this._near.data.name;
      prompt.style.opacity = '1';
      prompt.classList.add('visible');
    } else {
      prompt.style.opacity = '0';
      prompt.classList.remove('visible');
    }

    // Interact trigger
    if (this.keys.interact && !this._iLatch) {
      this._iLatch = true;
      if (dlgOpen) {
        this.dialog.advance();
      } else if (this._near) {
        this._openDialog(this._near);
      }
    }
    if (!this.keys.interact) this._iLatch = false;

    // Zone
    this._checkZone();

    // Check player death from damage / hazards
    if (this.player.hp <= 0 && !this._respawning) {
      this._respawnPlayer();
    }

    // HUD
    this.state.hp    = this.player.hp;
    this.state.maxHp = this.player.maxHp;
    this._updateHUD();
  }

  _respawnPlayer(msg = 'Vitalitas habis. Kembali ke pelataran awal.') {
    if (this._respawning) return;
    this._respawning = true;
    this.cam.shake(12);
    const elHp = document.getElementById('hp-fill');
    if (elHp) {
      elHp.classList.add('animate-pulse');
      setTimeout(() => elHp.classList.remove('animate-pulse'), 800);
    }
    setTimeout(() => {
      if (this.dialog.active) this.dialog.close();
      this.player.reset();
      this.enemies = (typeof ENEMIES !== 'undefined' ? ENEMIES : []).map(e => new Sentinel(e));
      this.mysteryBlocks = (typeof MYSTERY_BLOCKS !== 'undefined' ? MYSTERY_BLOCKS : []).map(m => new MysteryBlock(m));
      this.state.hp = this.player.hp;
      this._updateHUD();
      this._showZoneToast(msg);
      this._respawning = false;
    }, 800);
  }

  _openDialog(sp) {
    const art = sp.data;
    if (!art.discovered) {
      art.discovered = true;
      this.state.found++;
      this.state.score += 100;
      // Particle burst at pickup position
      const { x: sx, y: sy } = this.cam.toS(sp.x + sp.w / 2, sp.y);
      this.parts.burst(sx, sy, art.accentColor, 14);
    }
    this.player.triggerInteract();
    this.dialog.open(art, () => {
      // On dialog close — award XP for correct quiz
      if (this.dialog._correct && !this.dialog._xpAwarded) {
        this.dialog._xpAwarded = true;
        this.state.score += art.quiz.xp;
        SFX.discover();
      }
      if (this.state.found >= this.state.total) {
        setTimeout(() => {
          document.getElementById('win-banner').classList.remove('hidden');
        }, 500);
      }
    }, (correct) => {
      // Called immediately upon selecting an answer
      if (!correct) {
        const dmg = 20;
        this.player.hp = Math.max(0, this.player.hp - dmg);
        this.state.hp  = this.player.hp;
        this._updateHUD();
        this.cam.shake(9);
        const { x: sx, y: sy } = this.cam.toS(this.player.cx, this.player.cy);
        this.parts.burst(sx, sy, '#ef4444', 16);

        // Flash HUD vitalitas
        const elHp = document.getElementById('hp-fill');
        if (elHp) {
          elHp.classList.add('animate-pulse');
          setTimeout(() => elHp.classList.remove('animate-pulse'), 800);
        }

        // If HP depleted, respawn player and notify
        if (this.player.hp <= 0) {
          this._respawnPlayer();
        }
      }
    });
  }

  _render() {
    const ctx  = this.ctx;
    const cam  = this.cam;
    const imgs = this.loader;

    // Background
    drawBackground(ctx, cam.x);

    // Props (behind platforms)
    PROPS.forEach(p => {
      if (!cam.sees(p.x, p.y, 60, 120)) return;
      const { x: sx, y: sy } = cam.toS(p.x, p.y);
      this.tiles.drawProp(ctx, imgs.get('tiles'), p.type, sx, sy);
    });

    // Platforms
    PLATFORMS.forEach(p => {
      if (!cam.sees(p.x, p.y, p.w, p.h)) return;
      const { x: sx, y: sy } = cam.toS(p.x, p.y);
      this.tiles.drawPlatform(ctx, imgs.get('tiles'), sx, sy, p.w, p.h, p.type);
    });

    // Mystery ? Blocks (Super Mario style)
    this.mysteryBlocks.forEach(m => m.draw(ctx, cam));

    // Hazards (Duri Candi / Spikes)
    this.hazards.forEach(h => h.draw(ctx, cam));

    // Patrolling Sentinels (Goomba-style enemies)
    this.enemies.forEach(e => e.draw(ctx, cam));

    // Sacred Warp Pipe / Goal Altar (back/mid)
    this._drawGoalShrine(ctx, cam);

    // Artifact pickups
    this.sprites.forEach(sp => {
      sp.draw(ctx, cam, imgs.get(sp.data.assetKey));
    });

    // Particles
    this.parts.draw(ctx);

    // Player (sinks downward into the pipe during victory sequence)
    const sinkY = (this.victoryState && this.victoryState.active) ? this.victoryState.sinkY : 0;
    this.player.draw(ctx, cam, imgs.get('mascoot'), sinkY);

    // Sacred Warp Pipe FRONT RIM (drawn on top of the player so the player sinks inside!)
    this._drawGoalPipeFront(ctx, cam);

    // Minimap bar
    drawMinimap(ctx, this.player, this.sprites);

    // Textbox dialog (on top of everything)
    if (this.dialog.active) {
      const art = this.dialog.artifact;
      this.dialog.draw(ctx, imgs.get('textbox'), imgs.get(art.assetKey));
    }

    // Victory Celebration Modal (on top of canvas when victory sequence completes)
    if (this.victoryState && this.victoryState.active) {
      this._drawVictoryModal(ctx);
    }
  }

  _updateVictory(dt = 1) {
    const v = this.victoryState;

    if (v.step === 'walking') {
      this.player.facing = 1;
      this.player.state = 'walk';
      this.player.x += 1.8 * dt;
      this.player._anim(SPRITE.walk.frames, SPRITE.walk.fps, dt);

      if (this.player.x >= 3094) {
        this.player.x = 3094;
        this.player.state = 'idle';
        v.step = 'celebrating';
        v.timer = 0;
        if (!v.fanfarePlayed) {
          v.fanfarePlayed = true;
          SFX.victory();
          this.cam.shake(7);
          this.parts.burst(this.player.cx, this.player.cy - 12, '#D4AF37', 24);
        }
      }
    } else if (v.step === 'celebrating') {
      v.timer += dt;
      this.player.state = 'interact'; // raise hands in victory
      this.player._anim(SPRITE.interact.frames, SPRITE.interact.fps, dt);

      v.fireworksT += dt;
      if (v.fireworksT >= 10) {
        v.fireworksT = 0;
        const cols = ['#D4AF37', '#22c55e', '#38bdf8', '#f59e0b', '#ef4444'];
        const col = cols[Math.floor(Math.random() * cols.length)];
        this.parts.burst(this.player.cx + (Math.random() - 0.5) * 90, 150 + Math.random() * 45, col, 16);
      }

      if (v.timer >= 65) {
        v.step = 'sinking';
        v.timer = 0;
        if (!v.pipePlayed) {
          v.pipePlayed = true;
          SFX.pipe();
        }
      }
    } else if (v.step === 'sinking') {
      this.player.state = 'idle';
      v.sinkY += 1.6 * dt;

      v.fireworksT += dt;
      if (v.fireworksT >= 14) {
        v.fireworksT = 0;
        this.parts.burst(this.player.cx + (Math.random() - 0.5) * 80, 140 + Math.random() * 40, '#D4AF37', 14);
      }

      if (v.sinkY >= 44) {
        v.sinkY = 44;
        v.step = 'complete';
        v.timer = 0;
      }
    } else if (v.step === 'complete') {
      v.timer += dt;
      v.fireworksT += dt;
      if (v.fireworksT >= 24) {
        v.fireworksT = 0;
        const cols = ['#D4AF37', '#22c55e', '#38bdf8', '#f59e0b'];
        const col = cols[Math.floor(Math.random() * cols.length)];
        this.parts.burst(this.player.cx + (Math.random() - 0.5) * 120, 130 + Math.random() * 50, col, 18);
      }

      // Auto-reset after 5 seconds (300 frames)
      if (v.timer >= 300) {
        this.fullReset();
      }
    }
  }

  _drawGoalShrine(ctx, cam) {
    const PIPE_X = 3072, PIPE_Y = 276, PIPE_W = 46, PIPE_H = 36;
    if (!cam.sees(PIPE_X - 60, PIPE_Y - 90, PIPE_W + 120, PIPE_H + 90)) return;

    const { x: sx, y: sy } = cam.toS(PIPE_X, PIPE_Y);

    ctx.save();

    // 1. Torches with flickering fire on both sides
    const t = Date.now() * 0.008;
    const flk = Math.sin(t * 3) * 2;
    [sx - 28, sx + PIPE_W + 20].forEach(tx => {
      // Stone pedestal
      ctx.fillStyle = '#4A3B32';
      ctx.fillRect(tx, sy + 8, 10, 28);
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(tx - 2, sy + 6, 14, 4);
      // Fire bowl
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.arc(tx + 5, sy + 6, 6, Math.PI, 0);
      ctx.fill();
      // Glowing flame
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(tx + 5, sy - 2 + flk, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(tx + 5, sy - 1 + flk, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(tx + 5, sy - 3 + flk, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Goal Banner on tall stone flagpole
    const poleX = sx + PIPE_W / 2 + 18;
    ctx.fillStyle = '#8B5A2B';
    ctx.fillRect(poleX, sy - 64, 3, 72);
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(poleX + 1.5, sy - 64, 4, 0, Math.PI * 2);
    ctx.fill();
    // Waving golden flag
    const wave = Math.sin(t * 2) * 3;
    ctx.fillStyle = '#C2593F';
    ctx.beginPath();
    ctx.moveTo(poleX + 3, sy - 64);
    ctx.lineTo(poleX + 32, sy - 54 + wave);
    ctx.lineTo(poleX + 3, sy - 44);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 6.5px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('PUSAKA', poleX + 5, sy - 54 + wave * 0.5);

    // 3. Sacred Stone Warp Pipe Body (Back/Mid)
    ctx.fillStyle = '#3E2F26';
    rrect(ctx, sx + 2, sy + 10, PIPE_W - 4, PIPE_H - 10, 3);
    ctx.fill();
    // Inner dark pit
    ctx.fillStyle = '#150E0A';
    ctx.fillRect(sx + 5, sy + 2, PIPE_W - 10, 10);

    ctx.restore();
  }

  _drawGoalPipeFront(ctx, cam) {
    const PIPE_X = 3072, PIPE_Y = 276, PIPE_W = 46;
    if (!cam.sees(PIPE_X - 10, PIPE_Y, PIPE_W + 20, 20)) return;
    const { x: sx, y: sy } = cam.toS(PIPE_X, PIPE_Y);

    ctx.save();
    // Front lip / rim of the sacred pipe (drawn ON TOP of player as player descends!)
    ctx.fillStyle = '#5A4434';
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.5;
    rrect(ctx, sx - 3, sy, PIPE_W + 6, 12, 4);
    ctx.fill(); ctx.stroke();

    // Ornate stone carved groove on the rim
    ctx.fillStyle = '#3E2F26';
    ctx.fillRect(sx + 2, sy + 4, PIPE_W - 4, 3);
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(sx + 6, sy + 5, 4, 1.5);
    ctx.fillRect(sx + PIPE_W - 10, sy + 5, 4, 1.5);
    ctx.restore();
  }

  _drawVictoryModal(ctx) {
    const v = this.victoryState;
    if (!v.active || v.step !== 'complete') return;

    ctx.save();
    // 1. Cinematic dark backdrop
    ctx.fillStyle = 'rgba(15, 10, 6, 0.78)';
    ctx.fillRect(0, 0, V_W, V_H);

    // 2. Ornate card frame centered
    const cw = 460, ch = 230;
    const cx = Math.round((V_W - cw) / 2); // 90
    const cy = Math.round((V_H - ch) / 2); // 65

    // Outer dark frame
    ctx.fillStyle = '#261B12';
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    rrect(ctx, cx, cy, cw, ch, 12);
    ctx.fill(); ctx.stroke();

    // Inner warm cream parchment
    ctx.fillStyle = '#F8F1E3';
    ctx.beginPath();
    rrect(ctx, cx + 8, cy + 8, cw - 16, ch - 16, 8);
    ctx.fill();

    // Decorative inner gold trim
    ctx.strokeStyle = 'rgba(180, 140, 80, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    rrect(ctx, cx + 12, cy + 12, cw - 24, ch - 24, 6);
    ctx.stroke();

    // 3. Header: Royal Seal & Title
    ctx.textAlign = 'center';

    const medX = V_W / 2;
    const medY = cy + 28;
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(medX, medY, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8B5A18';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#FFF8E7';
    ctx.beginPath();
    ctx.arc(medX, medY, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#8B5A18';
    ctx.font = 'bold 11px "Cinzel", serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', medX, medY + 0.5);

    ctx.textBaseline = 'top';
    ctx.font = 'bold 13px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#3E2211';
    ctx.fillText('PETUALANGAN PUSAKA TUNTAS', V_W / 2, cy + 50);

    ctx.font = '8.5px "Inter", sans-serif';
    ctx.fillStyle = '#7C5335';
    ctx.fillText('Selamat! Kamu telah mengamankan warisan adiluhung budaya Nusantara!', V_W / 2, cy + 68);

    // Decorative divider line
    ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
    ctx.fillRect(cx + 30, cy + 82, cw - 60, 1);

    // 4. Stats Grid
    const statY = cy + 92;
    const boxW = 185;
    const boxH = 46;

    // Stat Box 1: Poin Budaya (Score)
    const b1x = cx + 32;
    ctx.fillStyle = '#EFE5D2';
    ctx.strokeStyle = '#C4A882';
    ctx.lineWidth = 1;
    ctx.beginPath();
    rrect(ctx, b1x, statY, boxW, boxH, 6);
    ctx.fill(); ctx.stroke();

    ctx.font = 'bold 7.5px "Inter", sans-serif';
    ctx.fillStyle = '#8B4513';
    ctx.fillText('TOTAL SKOR BUDAYA', b1x + boxW / 2, statY + 8);

    ctx.font = 'bold 15px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#9C3D27';
    ctx.fillText(`${this.state.score} XP`, b1x + boxW / 2, statY + 22);

    // Stat Box 2: Pusaka Terkumpul (Artifacts)
    const b2x = cx + cw - 32 - boxW;
    ctx.fillStyle = '#EFE5D2';
    ctx.strokeStyle = '#C4A882';
    ctx.lineWidth = 1;
    ctx.beginPath();
    rrect(ctx, b2x, statY, boxW, boxH, 6);
    ctx.fill(); ctx.stroke();

    ctx.font = 'bold 7.5px "Inter", sans-serif';
    ctx.fillStyle = '#8B4513';
    ctx.fillText('PUSAKA TERKUMPUL', b2x + boxW / 2, statY + 8);

    ctx.font = 'bold 15px "Cinzel", Georgia, serif';
    ctx.fillStyle = this.state.found >= this.state.total ? '#16a34a' : '#C2593F';
    ctx.fillText(`${this.state.found} / ${this.state.total} Pusaka`, b2x + boxW / 2, statY + 22);

    // 5. Rank / Predikat Badge
    ctx.font = 'bold 9.5px "Inter", sans-serif';
    ctx.fillStyle = '#2E1F10';
    const rank = this.state.found >= 7
      ? '⭐⭐⭐ Mahapatih Pelindung Pusaka Agung'
      : (this.state.found >= 4 ? '⭐⭐ Satria Penjaga Warisan' : '⭐ Pengelana Budaya Muda');
    ctx.fillText(rank, V_W / 2, cy + 150);

    // 6. Action Button: Restart / Countdown
    const remSec = Math.max(1, Math.ceil((300 - v.timer) / 60));
    const btnW = 280;
    const btnH = 26;
    const btnX = Math.round((V_W - btnW) / 2);
    const btnY = cy + ch - 42;

    ctx.fillStyle = '#9C3D27';
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1;
    ctx.beginPath();
    rrect(ctx, btnX, btnY, btnW, btnH, 6);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#FAF6F0';
    ctx.font = 'bold 9.5px "Inter", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Main Lagi [ Tekan R / Klik ] (${remSec}s)`, V_W / 2, btnY + btnH / 2);

    ctx.restore();
  }

  fullReset() {
    this.victoryState = {
      active: false,
      step: 'idle',
      sinkY: 0,
      timer: 0,
      fireworksT: 0,
      fanfarePlayed: false,
      pipePlayed: false,
    };
    this.player.reset();
    this.player.x = 60;
    this.player.y = 220;
    this.cam.x = 0;
    this.dialog.active = false;

    // Reset artifacts for replay
    ARTIFACTS.forEach(a => a.discovered = false);
    this.sprites = ARTIFACTS.map(a => new ArtifactPickup(a));
    this.state.found = 0;
    this.state.hp = this.player.maxHp;
    this._updateHUD();

    // Reset enemies & mystery blocks
    this.enemies = (typeof ENEMIES !== 'undefined' ? ENEMIES : []).map(e => new Sentinel(e));
    this.mysteryBlocks = (typeof MYSTERY_BLOCKS !== 'undefined' ? MYSTERY_BLOCKS : []).map(m => new MysteryBlock(m));

    const wb = document.getElementById('win-banner');
    if (wb) wb.classList.add('hidden');

    this._showZoneToast('Pelataran Candi Majapahit — Petualangan Baru Dimulai');
  }

  _checkZone() {
    const px = this.player.x;
    let zone = 'Pelataran Candi Majapahit';
    if      (px < 620)   zone = 'Zona Keris — Pandai Besi Majapahit';
    else if (px < 1020)  zone = 'Zona Gerabah — Kriya Terakota UMKM';
    else if (px < 1400)  zone = 'Zona Kendang — Irama Sunda Kiwari';
    else if (px < 1760)  zone = 'Zona Angklung — Harmoni Bambu UNESCO';
    else if (px < 2250)  zone = 'Zona Kebaya — Busana Adat Nusantara';
    else if (px < 2620)  zone = 'Zona Asbak Bali — Kriya Paras UMKM';
    else if (px < 3040)  zone = 'Zona Batik — Warisan Tekstil Dunia';
    else                 zone = 'Gapura Agung — Puncak Kelulusan Pusaka';

    if (zone !== this._lastZone) {
      this._lastZone = zone;
      this._showZoneToast(zone);
    }
  }

  _showZoneToast(text) {
    const el = document.getElementById('zone-toast');
    if (!el) return;
    el.textContent = text;
    el.style.opacity = '1';
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => { el.style.opacity = '0'; }, 3500);
  }

  _updateHUD() {
    const s = this.state;
    const elScore = document.getElementById('hud-score');
    const elProg  = document.getElementById('hud-progress');
    const elHp    = document.getElementById('hp-fill');
    if (elScore)  elScore.textContent = `${s.score} XP`;
    if (elProg)   elProg.textContent  = `${s.found} / ${s.total}`;
    if (elHp) {
      const pct = Math.max(0, s.hp / s.maxHp * 100);
      elHp.style.width = `${pct}%`;
      elHp.style.background = pct > 50
        ? 'linear-gradient(90deg,#e05e3a,#f5a070)'
        : pct > 25
          ? 'linear-gradient(90deg,#f59e0b,#fcd34d)'
          : 'linear-gradient(90deg,#dc2626,#f87171)';
    }
  }

  /* ── Input ─────────────────────────────────────────────── */
  _bindControls() {
    // Unlock browser audio context on any user interaction
    ['keydown', 'mousedown', 'touchstart', 'pointerdown'].forEach(evt => {
      window.addEventListener(evt, () => { SFX.init(); }, { passive: true });
    });

    // Keyboard
    window.addEventListener('keydown', e => {
      SFX.init();
      if (['ArrowLeft',  'KeyA'].includes(e.code)) this.keys.left     = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right    = true;
      if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) { this.keys.jump = true; e.preventDefault(); }
      if (['KeyE', 'Enter'].includes(e.code) || (e.key && e.key.toLowerCase() === 'e')) {
        this.keys.interact = true;
      }
      // Reset via R key during victory celebration
      if (e.code === 'KeyR' || (e.key && e.key.toLowerCase() === 'r')) {
        if (this.victoryState && this.victoryState.active && this.victoryState.step === 'complete') {
          this.fullReset();
        }
      }
      // Num keys 1-4 for quiz
      if (e.code === 'Digit1') this.dialog.selectQuizOpt(0);
      if (e.code === 'Digit2') this.dialog.selectQuizOpt(1);
      if (e.code === 'Digit3') this.dialog.selectQuizOpt(2);
      if (e.code === 'Digit4') this.dialog.selectQuizOpt(3);
    });
    window.addEventListener('keyup', e => {
      if (['ArrowLeft',  'KeyA'].includes(e.code)) this.keys.left  = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = false;
      if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) this.keys.jump = false;
      if (['KeyE', 'Enter'].includes(e.code) || (e.key && e.key.toLowerCase() === 'e')) {
        this.keys.interact = false;
      }
    });

    // Canvas click — for quiz option selection & dialog advance
    this.canvas.addEventListener('click', e => {
      SFX.init();
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = V_W / rect.width;
      const scaleY = V_H / rect.height;
      const cx = (e.clientX - rect.left) * scaleX;
      const cy = (e.clientY - rect.top)  * scaleY;

      if (this.victoryState && this.victoryState.active && this.victoryState.step === 'complete') {
        this.fullReset();
        return;
      }

      if (this.dialog.active) {
        // Try quiz option click
        const opt = this.dialog.getClickedOption(cx, cy, this.loader.get('textbox'));
        if (opt >= 0) {
          this.dialog.selectQuizOpt(opt);
          return;
        }
        // Try advance click
        this.dialog.advance();
      } else if (this._near) {
        this._openDialog(this._near);
      }
    });

    // Touch D-pad
    const tmap = {
      'btn-left':     'left',
      'btn-right':    'right',
      'btn-jump':     'jump',
      'btn-interact': 'interact',
    };
    Object.entries(tmap).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (!el) return;
      const on  = e => { e.preventDefault(); SFX.init(); this.keys[key] = true; };
      const off = e => { e.preventDefault(); this.keys[key] = false; };
      el.addEventListener('touchstart',  on,  { passive: false });
      el.addEventListener('touchend',    off, { passive: false });
      el.addEventListener('touchcancel', off, { passive: false });
      el.addEventListener('mousedown', on);
      el.addEventListener('mouseup',   off);
      el.addEventListener('mouseleave',off);
    });

    // Reset
    document.getElementById('btn-reset')?.addEventListener('click', () => {
      this.fullReset();
    });

    // Audio toggle
    document.getElementById('audio-btn')?.addEventListener('click', () => {
      SFX.enabled = !SFX.enabled;
      const icon = document.getElementById('audio-icon');
      if (icon) icon.textContent = SFX.enabled ? 'ON' : 'OFF';
      audioBtn.classList.toggle('opacity-50', !SFX.enabled);
    });
  }

  _uiManager() {
    // Gallery toggle
    const gameSection    = document.getElementById('game-section');
    const gallerySection = document.getElementById('gallery-section');
    const toggleBtn      = document.getElementById('view-toggle-btn');
    const toggleText     = document.getElementById('view-toggle-text');
    let galleryMode      = false;

    toggleBtn?.addEventListener('click', () => {
      galleryMode = !galleryMode;
      if (galleryMode) {
        gameSection.classList.add('hidden');
        gallerySection.classList.remove('hidden');
        toggleText.textContent = 'Kembali Main';
        this._buildGallery();
      } else {
        gameSection.classList.remove('hidden');
        gallerySection.classList.add('hidden');
        toggleText.textContent = 'Galeri Pusaka';
      }
    });
  }

  _buildGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    grid.innerHTML = '';

    ARTIFACTS.forEach(art => {
      const card = document.createElement('div');
      card.className = 'gallery-card p-4 flex flex-col gap-3';
      card.innerHTML = `
        <div class="flex items-start gap-3">
          <img src="${ASSET_PATHS[art.assetKey]}" alt="${art.name}"
               class="w-16 h-16 rounded-xl object-contain shrink-0 bg-nusava-beige/40 border border-nusava-sand p-1"
               style="image-rendering:pixelated">
          <div class="min-w-0 flex-1">
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-1"
                  style="background:${art.accentColor}22;color:${art.accentColor};border:1px solid ${art.accentColor}55">
              ${art.category}
            </span>
            <h3 class="text-sm font-display font-bold text-nusava-wood leading-snug">${art.name}</h3>
            <p class="text-[11px] text-nusava-terracotta font-medium mt-0.5">${art.origin}</p>
          </div>
        </div>
        <p class="text-xs text-nusava-woodLight leading-relaxed line-clamp-3">${art.description}</p>
        <div class="flex items-center gap-2 text-[11px] font-semibold mt-auto ${art.discovered ? 'text-emerald-600' : 'text-nusava-sand'}">
          ${art.discovered ? 'Pusaka Ditemukan' : 'Belum Ditemukan'}
        </div>`;
      grid.appendChild(card);
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   §13  BOOT
───────────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => { window.game = new Game(); });
