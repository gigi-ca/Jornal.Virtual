import 'package:flutter/material.dart';

import '../models/publicacao.dart';
import '../services/publicacao_service.dart';
import '../core/theme/app_colors.dart';
import 'comentarios_modal.dart';

class PublicacaoCard extends StatefulWidget {
  final Publicacao publicacao;
  final int? usuarioId;
  final VoidCallback? atualizar;

  const PublicacaoCard({
    super.key,
    required this.publicacao,
    this.usuarioId,
    this.atualizar,
  });

  @override
  State<PublicacaoCard> createState() => _PublicacaoCardState();
}

class _PublicacaoCardState extends State<PublicacaoCard> {
  final PublicacaoService _service = PublicacaoService();

  late bool _curtida;
  late int _quantidadeCurtidas;
  bool _carregandoCurtida = false;

  @override
  void initState() {
    super.initState();

    _quantidadeCurtidas =
        widget.publicacao.curtidas.length;

    _curtida = widget.publicacao.curtidas.any(
      (curtida) {
        final usuario = curtida['usuario'];

        if (usuario is Map) {
          return usuario['id'] == widget.usuarioId;
        }

        return curtida['usuarioId'] == widget.usuarioId;
      },
    );
  }

  Future<void> _alternarCurtida() async {
    if (_carregandoCurtida) return;

    setState(() {
      _carregandoCurtida = true;
    });

    try {
      if (_curtida) {
        await _service.descurtir(widget.publicacao.id);

        setState(() {
          _curtida = false;
          _quantidadeCurtidas--;
        });
      } else {
        await _service.curtir(widget.publicacao.id);

        setState(() {
          _curtida = true;
          _quantidadeCurtidas++;
        });
      }
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            e.toString().replaceFirst(
              'Exception: ',
              '',
            ),
          ),
        ),
      );
    } finally {
      if (mounted) {
        setState(() {
          _carregandoCurtida = false;
        });
      }
    }
  }

  String _formatarData(DateTime data) {
    final agora = DateTime.now();
    final diferenca = agora.difference(data);

    if (diferenca.inSeconds < 60) {
      return 'agora';
    }

    if (diferenca.inMinutes < 60) {
      return 'há ${diferenca.inMinutes} min';
    }

    if (diferenca.inHours < 24) {
      return 'há ${diferenca.inHours} h';
    }

    if (diferenca.inDays < 7) {
      return 'há ${diferenca.inDays} d';
    }

    return '${data.day.toString().padLeft(2, '0')}/'
        '${data.month.toString().padLeft(2, '0')}/'
        '${data.year}';
  }

  String _nomeAutor() {
    return widget.publicacao.autor?['nome'] ??
        'Usuário';
  }

  String _tipoAutor() {
    final tipo = widget.publicacao.autor?['tipo'];

    switch (tipo) {
      case 'ADMINISTRADOR':
        return 'Administrador';

      case 'VERIFICADO':
        return 'Verificado';

      default:
        return 'Aluno';
    }
  }

  String? _fotoAutor() {
    final foto = widget.publicacao.autor?['fotoPerfil'];

    if (foto == null || foto.toString().isEmpty) {
      return null;
    }

    final fotoString = foto.toString();

    if (fotoString.startsWith('http')) {
      return fotoString;
    }

    return '${'http://localhost:3000'}/$fotoString';
  }

  @override
  Widget build(BuildContext context) {
    final foto = _fotoAutor();

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: const Color(0xFFF0DCE4),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 23,
                backgroundColor: const Color(0xFFF4D5E2),
                backgroundImage:
                    foto != null ? NetworkImage(foto) : null,
                child: foto == null
                    ? const Icon(
                        Icons.person,
                        color: Color(0xFFC92768),
                      )
                    : null,
              ),

              const SizedBox(width: 12),

              Expanded(
                child: Column(
                  crossAxisAlignment:
                      CrossAxisAlignment.start,
                  children: [
                    Text(
                      _nomeAutor(),
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
                    ),

                    const SizedBox(height: 2),

                    Text(
                      '${_tipoAutor()} · '
                      '${_formatarData(widget.publicacao.dataPublicacao)}',
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),

              IconButton(
                onPressed: () {},
                icon: const Icon(
                  Icons.more_horiz,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          if (widget.publicacao.texto != null &&
              widget.publicacao.texto!.isNotEmpty)
            Text(
              widget.publicacao.texto!,
              style: const TextStyle(
                fontSize: 15,
                height: 1.5,
              ),
            ),

          if (widget.publicacao.hashtags.isNotEmpty) ...[
            const SizedBox(height: 12),

            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: widget.publicacao.hashtags.map(
                (hashtag) {
                  final nome =
                      hashtag['nome']?.toString() ?? '';

                  return Text(
                    nome,
                    style: const TextStyle(
                      color: Color(0xFFC92768),
                      fontWeight: FontWeight.w600,
                    ),
                  );
                },
              ).toList(),
            ),
          ],

          const SizedBox(height: 16),

          const Divider(
            height: 1,
            color: Color(0xFFF1E8ED),
          ),

          const SizedBox(height: 8),

          Row(
            children: [
              InkWell(
                onTap: _alternarCurtida,
                borderRadius: BorderRadius.circular(30),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 7,
                  ),
                  child: Row(
                    children: [
                      Icon(
                        _curtida
                            ? Icons.favorite
                            : Icons.favorite_border,
                        size: 21,
                        color: _curtida
                            ? const Color(0xFFE83272)
                            : AppColors.textSecondary,
                      ),

                      const SizedBox(width: 6),

                      Text(
                        '$_quantidadeCurtidas',
                        style: TextStyle(
                          color: _curtida
                              ? const Color(0xFFE83272)
                              : AppColors.textSecondary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(width: 8),

              InkWell(
                onTap: () async {
                  await showModalBottomSheet(
                    context: context,
                    isScrollControlled: true,
                    backgroundColor: Colors.transparent,
                    builder: (_) => ComentariosModal(
                      publicacao: widget.publicacao,
                    ),
                  );

                  widget.atualizar?.call();
                },
                borderRadius: BorderRadius.circular(30),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 7,
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.chat_bubble_outline,
                        size: 20,
                        color: AppColors.textSecondary,
                      ),

                      const SizedBox(width: 6),

                      Text(
                        '${widget.publicacao.comentarios.length}',
                        style: const TextStyle(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}