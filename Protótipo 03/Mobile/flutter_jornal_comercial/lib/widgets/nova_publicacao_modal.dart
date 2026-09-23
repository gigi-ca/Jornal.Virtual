import 'package:flutter/material.dart';

import '../services/publicacao_service.dart';

class NovaPublicacaoModal extends StatefulWidget {
  final VoidCallback? atualizar;

  const NovaPublicacaoModal({
    super.key,
    this.atualizar,
  });

  @override
  State<NovaPublicacaoModal> createState() =>
      _NovaPublicacaoModalState();
}

class _NovaPublicacaoModalState
    extends State<NovaPublicacaoModal> {
  final TextEditingController _textoController =
      TextEditingController();

  final PublicacaoService _service =
      PublicacaoService();

  bool _carregando = false;

  Future<void> _publicar() async {
    final texto = _textoController.text.trim();

    if (texto.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Digite algo antes de publicar.',
          ),
        ),
      );

      return;
    }

    setState(() {
      _carregando = true;
    });

    try {
      await _service.criarPublicacao(
        texto: texto,
      );

      if (!mounted) return;

      Navigator.pop(context);

      widget.atualizar?.call();

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Publicação criada com sucesso!',
          ),
        ),
      );
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
          _carregando = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _textoController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(22),
      ),
      child: ConstrainedBox(
        constraints: const BoxConstraints(
          maxWidth: 600,
        ),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment:
                CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Expanded(
                    child: Text(
                      'Nova publicação',
                      style: TextStyle(
                        fontSize: 23,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),

                  IconButton(
                    onPressed: _carregando
                        ? null
                        : () => Navigator.pop(context),
                    icon: const Icon(Icons.close),
                  ),
                ],
              ),

              const SizedBox(height: 20),

              TextField(
                controller: _textoController,
                maxLines: 7,
                maxLength: 1000,
                decoration: InputDecoration(
                  hintText:
                      'O que está acontecendo?',
                  alignLabelWithHint: true,
                  border: OutlineInputBorder(
                    borderRadius:
                        BorderRadius.circular(14),
                  ),
                  focusedBorder:
                      OutlineInputBorder(
                    borderRadius:
                        BorderRadius.circular(14),
                    borderSide: const BorderSide(
                      color: Color(0xFFC92768),
                      width: 2,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 8),

              const Text(
                'Use #hashtags no texto. Elas serão '
                'identificadas automaticamente.',
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 12,
                ),
              ),

              const SizedBox(height: 20),

              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed:
                      _carregando ? null : _publicar,
                  style: ElevatedButton.styleFrom(
                    backgroundColor:
                        const Color(0xFFC92768),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(12),
                    ),
                  ),
                  child: _carregando
                      ? const SizedBox(
                          width: 21,
                          height: 21,
                          child:
                              CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Text(
                          'Publicar',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}